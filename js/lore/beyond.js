'use strict';
// Shattered Worlds - Hero Stories, the realm of THE BEYOND (not of this world). Data only; see js/lore/sky.js for the shape.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.realms.beyond = { id: 'beyond', name: 'THE BEYOND', sub: 'Not of This World', col: '#b48cff', hi: '#e8d8ff',
    desc: `The Engine did not only tear two worlds into ours. It tore a hole in the dark between worlds, and the hole never quite closed. What came through it was never human, or stopped being human on the way. Halcyon calls them anomalies. They call this world the near side.` };
  L.order.push('beyond');

  Object.assign(L.heroes, {
    convergence: { realm: 'beyond', quote: 1,
      origin: `Aurelia-born, as Director Calder Sayle. Remade inside the Engine.`,
      role: `What the Director of Halcyon became`,
      look: `A tall shape of black void cracked with violet light, a man's outline at its centre, and the Engine's great wheel turning slowly behind it.`,
      story: [
        `Director Calder Sayle ran Halcyon for twenty years. When Dr. Kessen's Engine tore two worlds into ours, she wanted to switch it off. He wanted to switch it up. He collected the torn-through, numbered them, and fed their power to the Engine through its feed lines. What was left afterwards he called Husks.`,
        `His plan was to run the Engine harder than it had ever run, open the Beyond all the way and drink it dry, so that Aurelia would never fall again. When the heroes reached the Engine core he stepped backwards into its light, and the Engine took him in. What came out uses everything it ever drank: Void Shard, Rift Step, World Rend, Engine Light.`,
        `Pell was his hands. Rue was his faces. He never learned one of their names; he only numbered them. When World's End rains on everyone:`] },

    vega: { realm: 'beyond', quote: 0,
      origin: `Born by the Frozen Harbour. Fell up through the tear, into the stars between worlds.`,
      role: `Halcyon Subject 88, the pylon of Chamber Six`,
      look: `Long midnight-blue hair, a thin gold circlet set with two white gems, a deep violet robe, and a small black sphere ringed in violet light over her palm, tiny stars orbiting it.`,
      story: [
        `The harbour's navigators steered by a falling star, and named a girl for it. When the tear opened, Vega fell the other way: up, into the dark between worlds, where stars hang that belong to nobody's sky. She came back carrying the weight of one. Halcyon found her and put her in Pylon Chamber Six.`,
        `Aurelia floats on anti-gravity pylons. For a year, one of those pylons was Vega. Heavy Star, Crush, a Singularity that grinds, Fall Up that drops enemies into the sky: everything falls toward her eventually, and for a year a whole city was falling toward her and never hitting the ground.`,
        `Tessa, who knows how every story ends, sat with her in the dark and told her about the one where she lets go. Lux, from a world of light, calls her the only kind star she has met. When Event Horizon lifts every enemy and gravity remembers them:`] },

    tessa: { realm: 'beyond', quote: 2,
      origin: `Born by the Frozen Harbour. Came out of the tear unstuck in time.`,
      role: `Halcyon Subject 09, reader of the Archive`,
      look: `Short auburn hair, brass goggles pushed up on her forehead, a brown waistcoat over rolled white sleeves, a pocket watch held up on its chain, clock hands glowing round her.`,
      story: [
        `A girl with ink on her nose used to write tomorrow's tides on a slate on the harbour wall, and she was never once wrong. The tear opened through time as well as space, and Tessa came out of it unstuck. She has lived this year more times than she will say. She has already seen how it ends. She did not like it.`,
        `Stopwatch, Rewind, Slow Hour, Second Hand, Time Bomb, and the Stopped Clock. Halcyon kept her in the Archive, numbered 09, to read the future for the Director. She read him the bad endings and kept the good one to herself. She showed it to Isa. She sat with Vega in the dark and told her about it.`,
        `Corvin's crows bring omens; Tessa thinks they are guessing. Orin keeps finding doors she has already walked through. This time round, she is trying the other door. When the Stopped Clock starts again:`] },

    orin: { realm: 'beyond', quote: 0,
      origin: `Born on Vharra's steppe. Fell through the tear, and through the dark beyond it.`,
      role: `Walker of the Beyond's doors`,
      look: `Spiky dark violet hair, a deep indigo sleeveless coat, forearms wrapped in glowing magenta cloth, one hand pushing through a tall magenta doorway hanging in the air.`,
      story: [
        `A herder's tent on the steppe had a flap at each end. A boy walked in one side while his mother counted to ten at the other, and he came out of a tent three camps away, grinning, with somebody else's bread. When the sky tore, Orin was standing in a doorway. He fell through the tear, and through the dark beyond it, and found that the dark was full of doors.`,
        `Block at the last instant and he is simply somewhere else: a Rift Bolt that passes through walls, a Fold that drags you through to his feet, Gate Lance, Back Door, Door Barrage. Halcyon caught him on Platform Zero, the oldest stop in Deepline, stepping out of nothing. He did not stay caught.`,
        `Isa slams doors with ink and Orin opens them; they will never agree which is harder. Mira and Tessa are the only ones who can follow where he goes, and he is the one who means to close the Director's door behind him. When the Thousand Doors shut:`] },

    noct: { realm: 'beyond', quote: 1,
      origin: `Born by the Frozen Harbour, its watchman in the dark. The first thing to come back out of the Beyond.`,
      role: `Halcyon Subject 00, of the Blank Wing`,
      look: `A hooded swordsman in matte black and dark teal, his face lost in shadow except for one glowing teal eye, gripping a hilt whose blade is only a thin teal outline in the air.`,
      story: [
        `In the harbour at night there was nothing in the dark that was not supposed to be there. Noct kept it that way. When the tear opened, things came out of the dark between worlds, and he went in after them. He was the first thing that came back. Halcyon numbered him 00 and kept him in the Blank Wing, a room with no shadows in it.`,
        `The cut arrives. He does not. Unseen Cut, Afterimage, a Null Crescent through everything, Lights Out, Blink Strike. Vesper lit the harbour's lamps and he kept the dark beyond them clean. They found each other again in Halcyon's halls, and never needed to say so.`,
        `Sen has sworn to see his blade once. Corvin's crows will not fly near him. He speaks very rarely. When the Last Light falls and everything on the screen is on the wrong side of it:`] },

    mira: { realm: 'beyond', quote: 2,
      origin: `The reflection under the Frozen Harbour's ice. Stepped out when the tear cracked it.`,
      role: `Halcyon Subject 03, of the Observation Gallery`,
      look: `Long slate-grey hair, a smooth silver mirror mask over the upper half of her face with one cyan glint, a grey-blue tunic, and a long mirror shard in which her reflection faces the other way.`,
      story: [
        `At noon on the harbour, if you looked down into the ice, there was a girl underneath it smiling up at you. When the tear cracked the ice, she stepped out. Mira is the reflection. Somewhere there is a girl with no reflection, and Mira has never gone to look for her.`,
        `What you hit was only her reflection: Glass Fan, Reflection, Prism, Hall of Mirrors, Kaleidoscope. Halcyon numbered her 03 and put her behind the glass of the Observation Gallery. For her, glass was only ever a door.`,
        `Rue copies faces and Mira reflects them, and there is a difference: in a mirror, Mira is the only one who can see what Rue really is, which is nothing. Lux bends light through her glass. Orin walks through the doors she does. When Seven Years' Luck cracks the world:`] },

    hex: { realm: 'beyond', quote: 2,
      origin: `Born on a world that ended before the Engine ever found it.`,
      role: `The ghost of the Bone Garden`,
      look: `A thin young woman with pale grey-green skin in a dark navy hood and ragged cloak, glowing mint-green eyes, voodoo pins between her fingers, ghost light round her.`,
      story: [
        `Hex and her twin brother Corvin come from a world that ended before the Engine ever found it. Everything there happened twice: once when it happened, and again later, when it was remembered. Hex still works that way. A part of everything she does to you hits again two seconds later.`,
        `Hex Bolt, Soul Swap, Voodoo Pins, a Doom Mark that goes off whatever you do, and Hollow, where she drifts through you as a ghost. She came through the tear already half a ghost, and found the only quiet place on the near side: Thorne's Bone Garden, where the dead do not mind company.`,
        `Rue tried to copy her once and felt everything twice for a week. Hex found that funny. Corvin worries about her; she curses him for it. When the Requiem has sung and every wound opens twice:`] },

    corvin: { realm: 'beyond', quote: 1,
      origin: `Born on a world that ended. Came through with his twin, and the crows.`,
      role: `Reader of omens`,
      look: `A gaunt young man in a black feathered hood with a gold beak-shaped clasp, one eye glowing violet, black crows bursting out of his cloak.`,
      story: [
        `You hit him. You hit a crow. Corvin and his twin sister Hex came out of a dead world through the tear, and the crows came with them: they are what his world sent to watch its own end. Crow Volley, Scatter, Black Flame, Moon Gaze, Murder of Crows.`,
        `He reads omens. He has read this world's, and he does not like it. Tessa says omens are only guesses; Corvin says time is only a crow that has not landed yet. His crows went for Isolde's ice falcon on her first night free, and she has hated every crow since. He has apologised eleven times.`,
        `Noct is the one thing his crows will not fly near. Hex he would give the last of his world for. When the Crow Eclipse turns the sky red:`] },

    rue: { realm: 'beyond', quote: 1,
      origin: `Came through the tear with no face, no voice and no shape.`,
      role: `Pell's best spy, until she was not`,
      look: `A slim young woman in a white theatre mask with a painted smile, peach and pink clothes, a second mask in her hand, faint ghostly copies of other fighters behind her.`,
      story: [
        `She came through the tear with no face, no voice and no shape of her own. Halcyon put her in the Blank Wing next to Noct. Pell found her there and taught her the only thing she had a talent for: show her a move once, and she will show it back to you, better.`,
        `Copy, Mirror Step, Masquerade, Perfect Copy, Echo. For the Director she wore anyone's face. She wore Kael's to turn the Sky against Deepline, and Nyra's to turn Deepline against the Sky, and for a whole season every layer believed it.`,
        `Mira looked at her in a mirror and saw nothing, and Rue has hated mirrors since. Kiri and Rook, with their doubles and clones, are the only ones she cannot copy without getting lost. It was Slick, who has no shape either, who asked her what she looked like underneath, and waited for the answer. When the Masquerade Ball ends:`] },

    opal: { realm: 'beyond', quote: 0,
      origin: `Born on a world of crystal and light. Fell into the eastern desert.`,
      role: `The girl who made the Glass Sea`,
      look: `A gentle young woman with pink hair in a bun, a pale blue and pink outfit, a glowing pink crystal in her hands, and pink, mint and blue crystals growing round her feet.`,
      story: [
        `Opal and her sister Lux come from a world of crystal and light, where every garden grows gems. The tear set her down in the eastern desert, and everything she touched turned to crystal: half a mile of sand in one frightened night. That was the beginning of the Glass Sea.`,
        `Crystal Shard grows a crystal where it lands; Geode Wall, Crystal Bloom, a Prism Prison, and a Shatter Song that bursts every crystal she has grown at once. Dune has never forgiven her for the desert. Opal has never forgiven herself.`,
        `Brakk found her crying in the Glass Sea and carried her out on his shoulder; she still sits there when she is scared. Lux keeps her bright. When Diamond Dust breaks the air itself:`] },

    lux: { realm: 'beyond', quote: 1,
      origin: `Born on a world of crystal and light. Caught in Halcyon's Med-Lab.`,
      role: `The light that would not bottle`,
      look: `Long white hair, a blue and gold outfit, and a thin crystal lance that splits a beam of light into a rainbow, prism colours all round her.`,
      story: [
        `In the world of crystal and light, Lux was the one who carried the light into the gardens. One beam goes in; seven come out. The tear dropped her sister Opal in the desert and Lux in Halcyon's Med-Lab, where they tried to bottle her and found that light does not bottle.`,
        `Prism Shot bounces off the edge of the world and hits harder after; Split Beam, Spectrum Lance, Mirror Field, Blinding Flash. Mira's glass bends her light in ways even Lux did not know it could go. She taught Yara to put light on an arrow.`,
        `Vega is the only star she has met here, and the only one that was kind. She keeps Opal bright when the glass gets too heavy. When the Rainbow Road meets in one point:`] },

    slick: { realm: 'beyond', quote: 1,
      origin: `Came through the tear as a puddle.`,
      role: `The friendliest thing on the Drowned Line`,
      look: `A round, grinning man made of see-through green slime in a simple dark green vest, wobbling and dripping, puddles round his feet.`,
      story: [
        `Squash him flat; he just comes back together. Slick came through the tear as a puddle and spent his first month on the near side being stepped in. He did not mind. He found it a very friendly way to meet people.`,
        `Slime Ball, Slide, Engulf, Split, Belly Flop: his slime slows his enemies and heals him, and he is honestly quite hard to hurt. He followed Nami home from the Drowned Line because she was the first person who said sorry after stepping in him. He brings Apis's bees honey from somewhere; nobody asks where.`,
        `Rue has no shape either. Slick asked her what she looked like underneath, and waited, and he is the reason she found out. When Tidal Goo has rolled over everyone and squeezed:`] },

    apis: { realm: 'beyond', quote: 2,
      origin: `Queen of a hive the size of a world, until an engine drank it.`,
      role: `The hive that escaped`,
      look: `Black hair under a small golden crown, a striped amber and black jacket, and a cloud of glowing bees circling her outstretched hand.`,
      story: [
        `She is never alone. She is never quiet, either. Apis was the queen of a hive the size of a world, until an engine very like Kessen's found it and drank it dry. She and one swarm escaped through the dark between worlds, and came out of the tear starving.`,
        `Sting, Honey Trap, Hive Burst, Royal Jelly, Waggle Dance: every hit adds a bee to her swarm, and at eight they all attack. Ume let her bees feed in the Glowwild when no one else would let them near. Kestra's fire moths and her bees have an understanding, which is that they hate each other.`,
        `She is the only one on the near side who has seen what an engine becomes when nobody switches it off. She has told everyone. Slick listened. When the Killer Swarm darkens the sky:`] },

    mika: { realm: 'beyond', quote: 2,
      origin: `Born on a world with two moons. Came through the Crater rift.`,
      role: `Traveller between worlds`,
      look: `A long silver-white ponytail, a deep indigo bodysuit with periwinkle trim, mid-leap with two crescent blades, two pale moons behind her.`,
      story: [
        `Look up from Mika's world and you see two moons. The pull of both keeps everyone a little lighter, and children there learn to jump before they learn to walk. Our world has one moon, and Mika has decided that is not reason enough to come down.`,
        `She has not touched the ground since the fight began: Crescent Toss, a Moon Vault over you, Twin Orbit, Lunar Dive, Lunar Halo, and every hit in the air gives her jumps back. Sora, who rides a kite above Aurelia, cannot stand that someone stays up longer. Coda, the Noble Ring's dancer, asked Mika to teach her to leap without a net.`,
        `She came through the tear with Ryo and Itsuki, who walk between worlds, and she has stayed at Ryo's side, because light and dark need someone between them. When the two moons rise and she cuts across the arena by their light:`] },

    ryo: { realm: 'beyond', quote: 0,
      origin: `Born between worlds. Walks from tear to tear.`,
      role: `Closer of tears, light and dark`,
      look: `A composed young man with short black hair, a gi white on one side and black on the other, one palm glowing white and the other dark, a turning yin-yang circle behind him.`,
      story: [
        `Light in one hand, dark in the other; both hands hit. Ryo and his sworn brother Itsuki walk between worlds, closing the tears that engines leave behind. They have closed three. This one is the largest they have ever seen.`,
        `Light Palm, Light Step, Dark Palm, Eclipse, Taiji Turn: switching sides builds Balance, and using the same side twice loses it. Ryo has to keep both sides of everything, himself included. Hollis, who has kept three layers in balance for a lifetime, gave them a room in the Hidden village and listened to them for a whole night.`,
        `Mika came through with them and stays at his side. Itsuki wants to rush and Ryo wants to wait; between them they are usually on time. When Harmony turns over the arena and sets everything right:`] },

    itsuki: { realm: 'beyond', quote: 0,
      origin: `Born between worlds. Learned five elements on five of them.`,
      role: `Closer of tears, student of five worlds`,
      look: `Spiky black hair under a red headband, a dark blue gi with a gold sash, and five floating orbs of fire, wind, lightning, earth and water circling him.`,
      story: [
        `Fire, wind, thunder, earth, water: he learned them all, in that order, on five different worlds. Itsuki and his sworn brother Ryo walk between worlds closing the tears that engines leave behind, and on every world he stays long enough to learn one thing from its best.`,
        `Every skill is cast in his current element, then the wheel turns: Element Bolt, Element Step, Element Pillar, Five Seals, The Wheel Turns. On the near side he went looking for the best of each. He found a boy called Kael throwing thunder in Deepline and challenged him on the spot. He found Gale's wind and asked to be taught; Gale asked to be paid.`,
        `He wants to close the tear today; Ryo wants to close it properly. When the Five Calamities fall one after another:`] }
  });
})();
