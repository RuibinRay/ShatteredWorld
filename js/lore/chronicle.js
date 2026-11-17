'use strict';
// Shattered Worlds - Hero Stories, THE CHRONICLE: the full storyline of the 64 heroes, told through their
// realms, backgrounds and relationships. It stands apart from the story mode's acts (the user may change those);
// it borrows only the world's facts from the prologue: the Ashfall War, Aurelia, Deepline, Kessen's Engine.
// Each chapter: title, cast (hero ids shown as faces), paragraphs.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.chapters.push(
    { title: 'Prologue: Three Layers', cast: ['hollis', 'oda'], text: [
      `In 2091 the Ashfall War burned the surface of the world in forty-one days. Afterwards the rich went up, to Aurelia, a city of gold towers floating on anti-gravity pylons. The poor went down, into the old metro lines, and called it Deepline. Everyone else was left on the Surface, with the dunes and the ash.`,
      `On the first night after the war, a handful of families met round a fire on a mountain and refused to choose. They swore to live in all three layers at once - hidden in the undercroft of the sky city, in the tunnels of Deepline, and in a village on the Surface that no map would ever show - and to keep the three from killing each other.`,
      `A young monk called Oda rang a bell over the oath. A young hermit called Hollis wrote it down. They called themselves the Hidden Clans, and the Pact of Three Layers held for ninety-six years.`,
      `It held until Aurelia began to run out of power.`] },

    { title: '1. The Tear', cast: ['convergence', 'noct', 'vega', 'mira', 'orin', 'tessa'], text: [
      `In 2187 Dr. Veyra Kessen built the Convergence Engine under the Spire of Aurelia, to pull power out of the worlds next door. Director Calder Sayle of Halcyon ordered it run at full power. The first test tore two worlds into ours.`,
      `Vharra came through in pieces: the storm steppe, the grass, the thunderheads. So did the Frozen Harbour: the ice, the sea wall, the lamps. Their people were scattered across all three layers with no names, no powers and no memories. What they had been was shredded into Memory Shards and blown across the world.`,
      `But the Engine had not only torn two worlds. It had torn a hole in the dark between worlds - the Beyond - and the hole never quite closed. Things came through it that were never human: a hooded swordsman whose blade was not there, a woman carrying the weight of a star, a girl who was a reflection, a boy who fell through a doorway and found the dark was full of doors, a tide-reader who came out of it unstuck in time.`,
      `Kessen wanted to switch the Engine off. The Director had a better idea. Everyone who came through the tear had power in them, and power can be collected. Halcyon began to number them.`] },

    { title: '2. The Tanks', cast: ['nyra', 'isolde', 'maren', 'pyra', 'elixa', 'ashka', 'aldric', 'vesper'], text: [
      `Halcyon called them Subjects. Noct was 00, because he was the first. Mira was 03, Tessa 09. Aldric, found standing guard over the rubble of a sea wall that no longer existed, was 12. Nyra was 31, Pyra 44, Isolde 52, Yara 57, Ashka 60, Vesper 77, Vega 88. Elixa mixed the serums that woke their powers. Maren, Subject 21, had been a doctor before she was a number, so they made her doctor to the rest.`,
      `The power went into the Engine through its feed lines. What was left afterwards walked and breathed and did not answer to its name. Halcyon called them Husks and swept them out to the Glowwild. Only Nyra could see the Husks still standing in the corridors. She told no one that she could.`,
      `Vega was put in Pylon Chamber Six, and for a year Aurelia floated on her. Ashka was chained in the Core Sump, and for a year half of Deepline was warm because she was in pain. Aldric was told the Subjects were protected, and he believed it, because he believed in oaths.`,
      `Then Pyra drank the seventh serum, and the bottle broke. She burned the Burn Ward to the frame, lifted Nyra off the floor and walked out through her own fire. The fire ran down the vents all the way to the Core Sump, where Ashka was waiting in the dark. And Maren, holding the door, looked the other way.`] },

    { title: '3. The Kid from the Trash', cast: ['kael', 'ferra', 'rook', 'sable', 'moro', 'pell', 'fenn', 'sen'], text: [
      `Deepline got the rest. A white-haired boy woke in the Crusher Yard under a car door, with static in his hair and no name. Ferra, the Scrap Queen, decided he was salvage. The slum kids called him Sparks. Rook, the loudest of the Lantern Cell, called him brother.`,
      `The Lantern Cell was three Deepline kids the Hidden Clans trained in secret: Rook with his clones, Sable with her thunder, Moro with his shadows. Their sensei was Pell, a smiling man in a porcelain mask, who taught them everything about strings except whose hand held his.`,
      `A hunter in a wolf-pelt hood broke out of Halcyon's Beast Pens and found Kael on his way up. He saw the storm-eye scratched on the boy's jacket and told him the name of the world he came from: Vharra. Fenn has been Kael's older brother ever since. Dyna blew holes in Halcyon's walls, Bando reached through them, and Sen kept a dojo in a rusted metro car and said nothing to anyone.`,
      `Then Pell sold the Lantern Cell to Halcyon for a key to the Engine. Rook's clones held the door until the last of them went up in smoke, and Rook came out of the smoke behind it. Sable went to the Rust Dojo and asked Sen to make her faster. Rook went to Kael. And Deepline learned that there were strings on it.`] },

    { title: '4. The Wide Land', cast: ['brakk', 'hollis', 'dune', 'tarek', 'opal', 'ume', 'apis', 'jax'], text: [
      `Brakk woke in Shaft Nine with a Halcyon drill in his hands and dug upward through four hundred metres of rock. He came out on the Surface, sat down on a mountain, and stayed there until an old man with a white beard sat down beside him. Hollis took him to the Hidden village, where Garo and Tor held the gate, Taro held the ring, Ivo trained before dawn, and Oda's bell rang every morning over the Pact.`,
      `The rest of the Surface was not so peaceful. In the east, Dune guarded the Buried Meridian against Tarek's chain raiders, until Halcyon sent drills instead of buyers and two old enemies found themselves holding the same chain. A frightened girl from the Beyond called Opal fell into the desert and turned half a mile of it to glass in one night. Dune never forgave her; Brakk carried her out of the Glass Sea on his shoulder.`,
      `In the Glowwild, Ume grew beautiful poison where Halcyon dumped the Husks, and let a starving swarm of Beyond bees feed when nobody else would. Their queen, Apis, told anyone who would listen what an engine becomes when nobody switches it off. Kova ran with the tigers and followed Brann north to learn the bear.`,
      `Jax kept the Long Bar at Mile Zero. Tarn ran the post from his porch to the Crater rim. Hart and Tor walked the caravans in between, and Fenn hunted whatever Halcyon let loose. Nobody ruled the Surface. That was about to matter.`] },

    { title: '5. The Noble Ring', cast: ['zara', 'coda', 'lin', 'kestra', 'isa', 'sora', 'gale', 'kiri'], text: [
      `High in Aurelia, on the Noble Ring, the gold towers did not notice that the city was falling. Zara's House Edge took the nobles' money politely, Lin stood behind her chair, and the winnings went quietly down the Skylift to Deepline. Coda danced at the opera and carried the guests' secrets home to Pell in her ribbons, hating every bow.`,
      `In the undercroft beneath the Ring, the Sky Clan kept the Pact alive: Kestra danced her fire-fan where the pylons hum, and Lin brought down what she heard at the card tables. In the Archive, Isa sealed the Director's laws in ink, until the Subject in the next room, Tessa, showed her the last page of the Director's story.`,
      `Above them all flew the Paper Post. Sora had come through the tear on her kite and never come down. Her brother Gale had fallen to the bottom of Deepline and ridden the Vent Stacks' updraft all the way back up to find her. Kiri had folded the wishes of the dead into a crane big enough to carry her up after them. They carried the letters Halcyon did not want sent, and the most important letter Isa ever wrote:`,
      `The Director was not trying to save Aurelia. He meant to run the Engine harder than it had ever run, open the Beyond all the way and drink it dry. And he meant to use the Subjects as the key.`] },

    { title: '6. The Near Side', cast: ['orin', 'mira', 'noct', 'corvin', 'hex', 'slick', 'ryo', 'itsuki', 'mika'], text: [
      `The Beyond-born called this world the near side. Most of them arrived alone. Corvin and Hex arrived together, twins from a world that had already ended, with crows. Lux was caught in the Med-Lab and found that light does not bottle. Slick arrived as a puddle and spent a month being stepped in, until Nami said sorry and he followed her home.`,
      `Orin found the others. Halcyon had caught him on Platform Zero stepping out of nothing, and he had not stayed caught. He walked through the Beyond's doors and brought out whoever he could: Mira through her glass, and Noct out of the Blank Wing, a room with no shadows, where the Subject numbered 00 had been kept for a year.`,
      `Not everyone in the Blank Wing wanted to leave. In the cell beside Noct's was a creature with no face, and Pell had found her first. He called her Rue, and taught her to wear anyone's.`,
      `And through the rift in the Crater came three travellers who had walked between worlds before: Ryo, with light in one hand and dark in the other; his sworn brother Itsuki, master of five elements learned on five worlds; and Mika, from a world with two moons, who did not see why she should come down. They had closed three tears already. They had never seen one this big.`] },

    { title: '7. False Faces', cast: ['rue', 'pell', 'kael', 'nyra', 'aldric', 'vesper'], text: [
      `The Director knew the layers would unite against him if they could. So he made sure they could not.`,
      `Rue put on Kael's face and opened the Core Sump's vents into Halcyon's labs, so that the Sky would believe Deepline had attacked it. She put on Nyra's face and led Halcyon's drills into the Deepline tunnels, so that the Underground would believe the escaped Subjects had sold them out. Pell pulled the rest of the strings: a rumour on the Surface, a forged seal on the Noble Ring.`,
      `It worked. The Proving Hall marched on Deepline. The chain raiders hit the Skylift. Kael went looking for the Subject called Nyra; Nyra went looking for the Deepline boy called Kael. They met in the Crater under a violet sky, each sure the other was a Halcyon agent, and fought each other to a standstill.`,
      `In Aurelia, Aldric led the Director's knights to the head of the Deepline stair. Vesper stopped him there. She did not argue. She took him down to the Engine's feed lines and showed him the Husks: Subjects he had been told were protected, standing in rows, not answering to their names. Aldric broke his oath to the Director that night, to keep the older one. The Proving Hall turned round.`] },

    { title: '8. The Turn', cast: ['tessa', 'vega', 'mira', 'rue', 'slick', 'coda', 'rook', 'elixa'], text: [
      `Tessa had lived this season before. Every time, it ended in the Crater with one of them dead. This time she went to Pylon Chamber Six and asked Vega to hold the moment still - a whole city's weight, on a single second - while she rewound it.`,
      `In the rewound second, Mira was standing beside the duel. She held up her mirror to the Kael who had opened the vents, and the reflection showed nothing at all. A copy has no reflection of its own. Kael and Nyra lowered their blades.`,
      `Rue ran. She ran into the Drowned Line, where a large green puddle asked her, kindly, what she looked like underneath, and waited for the answer. It took her a long time to find it.`,
      `On the Noble Ring, Coda cut her strings in the middle of the opera, in front of every noble in Aurelia, and danced Pell's secrets out in ribbons for the whole house to read. Pell fled to Deepline, where Rook, Sable and Moro were waiting. The Lantern Cell caught their sensei in his own Cat's Cradle.`,
      `In the ruins of her laboratory, Elixa found one of her results looking back at her - Pyra, warming her hands on the ashes - and asked, for the first time, what the serums had cost. Then she sat down with Maren and Ume and began work on a cure for the Husks.`] },

    { title: '9. Four Banners', cast: ['hollis', 'oda', 'isa', 'zara', 'vesna', 'apis'], text: [
      `Oda rang the bell in the Hidden village three times, which he had never done. Hollis read the Pact aloud. Then he crossed out three layers and wrote four.`,
      `They came under four banners. AURELIA, with Nyra and Isolde, Aldric and his turned knights, Kestra and Lin from the undercroft and the Paper Post overhead. THE SURFACE, with Fenn and Brakk, Dune and Tarek holding the same chain, Hart and Tor at the head of the column, Jax and his six. DEEPLINE, with Kael and Ferra, the Lantern Cell, Dyna and Mako, Ashka and Fumi, Bando, Sen and Nami, Vex from across the tunnel, and Thorne up out of his garden of bone. THE BEYOND, with Orin and Noct, Ryo and Itsuki, the twins and their crows, Apis and her swarm, and Rue, wearing a face that was finally her own.`,
      `Everyone paid something. Zara bet the House Edge on them, every chip. Vesna opened the Red Ledger at its longest page, the one for Halcyon, and called in every debt in Deepline at once. Isa sat down in the Archive with Lin at the door and began to write the Final Word, the seal that would unmake every law the Director had ever sealed.`,
      `And Apis told them, one last time, what an engine becomes when nobody switches it off. Nobody argued with her this time.`] },

    { title: '10. The Spire', cast: ['aldric', 'tor', 'yara', 'hart', 'jax', 'sora', 'mika', 'vega', 'dune', 'opal'], text: [
      `They climbed the Spire from four sides at once.`,
      `The Sky came up the inside, where Aldric's knights and the Last Wall of the Surface held the stairwells side by side: Tor and Aldric, two walls, finally seeing it for themselves. The Land came up the Skylift cables, with Yara, Hart and Jax arguing about range all the way up and hitting everything they argued about. The Paper Post came over the top - Sora on her kite, Gale on the wind, Kiri on her crane, Mika leaping between them - while Coda danced the guards off the walkways to a bell nobody else could hear.`,
      `Halcyon cut the pylons to drop Aurelia on the Surface and take the heroes down with it. Vega caught the city. She held it the way she had held it for a year, only this time she chose to, with Lux's light keeping her bright and Tessa's hand on her shoulder.`,
      `Under the Spire, in the Glass Sea, Dune and Opal stood back to back against the drills - the desert, and the girl who had glassed it - and for one night, Dune let the glass help.`] },

    { title: '11. Convergence', cast: ['convergence', 'kael', 'nyra', 'itsuki', 'ryo', 'orin', 'noct', 'sen'], text: [
      `The Engine core was a wheel of violet light as tall as a house, and in front of it stood a man in black with his hands behind his back. Director Calder Sayle had numbered every one of them. He did not remember a single name.`,
      `They fought him on the floor of his Engine, and they beat him. He stepped backwards into the light, and the Engine did not throw him out. It took him in.`,
      `What came out was the Convergence: everything the Engine had ever drunk, wearing the shape of a man. Void Shard, Rift Step, World Rend. It told them, in a voice made of a thousand Subjects, that they had always been fuel.`,
      `Pyra and Ashka burned its feed lines from below. Ferra and Vex, pulling the same way for once, tore the Engine's loose metal away. Itsuki turned his wheel through all five elements, and Ryo held light and dark round the core so that it could not spread. Orin opened a door behind it; Noct cut through the door; and Sen, at last, saw the blade. Then Kael and Nyra, who had been told to hate each other, struck together - thunder and winter - and the Convergence came apart into light.`] },

    { title: '12. After', cast: ['kael', 'nyra', 'fenn', 'noct', 'vesper', 'rue', 'oda', 'corvin', 'hex'], text: [
      `Kessen put the key in the Engine and turned it the other way. It ran backwards, once. The worlds came apart as gently as they had been torn together, and every Memory Shard went home to whoever it belonged to.`,
      `Not everyone went with them. Fenn went home to the steppe, and his storm-wolf ran to meet him across the grass. Isolde went back to the eyrie. Kael stood at the edge of the tear for a long time, and then he stayed, because Deepline was home now too; Nyra said two worlds was not so far, and walked it. Aurelia settled onto the Surface over a year, with Vega letting it down one floor at a time, and for the first time in ninety-six years the sky, the land and the underground were the same place.`,
      `The Beyond's door did not close all the way. Doors never do. Noct stayed on the threshold to keep the dark beyond it clean, and Vesper lit a lamp beside him. Ryo and Itsuki walked on to the next tear, with Mika between them. Rue kept her own face. Apis planted a hive in Ume's garden, and the honey was safe.`,
      `Oda rang the bell once and broke his vow of silence to say one word over the Pact of Four. Hollis says it was "together". Oda is not saying.`,
      `And far out in the dark between worlds, Corvin's crows saw something turn over. Slow, and enormous. Another engine. Hex said it would happen twice.`] }
  );
})();
