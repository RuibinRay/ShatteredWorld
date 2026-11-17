'use strict';
// Shattered Worlds - Hero Stories, the realm of DEEPLINE (the Underground). Data only; see js/lore/sky.js for the shape.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.realms.deep = { id: 'deep', name: 'DEEPLINE', sub: 'The Underground', col: '#ff3ea5', hi: '#ffc8e6',
    desc: `The old metro lines, where the poor went down and never came back up. Slums, scrapyards, the Pit Arena, the flooded Drowned Line, a shrine of paper and a garden of bone. Everything Aurelia throws away lands here, and Deepline makes something of it.` };
  L.order.push('deep');

  Object.assign(L.heroes, {
    kael: { realm: 'deep', quote: 1,
      origin: `Born on Vharra, under the thunderheads. Torn through; woke in a Deepline trash heap.`,
      role: `Street kid of the Crusher Yard`,
      look: `Shaggy white hair under a cyan headband, a long red scarf, a sleeveless slate-blue scrap jacket and bandaged forearms, amber lightning crackling round his fists.`,
      story: [
        `He woke in the Crusher Yard trash heap with no name, static in his hair and a stubbornness he could not explain. Ferra found him under a car door and decided he was salvage. The slum kids called him Sparks. Rook called him brother by the end of the first week.`,
        `Spark Dart, Thunder Totem, a Breaker Rush through walls and a Magnet Grip up them. A hunter in a wolf-pelt hood saw the storm-eye scratched on his jacket and told him where it came from: Vharra, the grass, the thunderheads. Fenn has looked after him ever since. Sable of the Lantern Cell thinks one Deepliner with lightning is plenty.`,
        `Halcyon told him an escaped Subject called Nyra had sold out the tunnels. He believed it, for one fight. The Director dropped him in the trash and called it an accident; Kael climbed out. When Skyfall hammers every enemy on the screen:`] },

    ashka: { realm: 'deep', quote: 0,
      origin: `Born by the Frozen Harbour, tender of the deep vents. Torn through; chained in the Core Sump.`,
      role: `Halcyon Subject 60, the furnace's prisoner`,
      look: `A powerful woman in black obsidian armour cracked with glowing lava veins, short black hair, molten rock dripping from her clenched gauntlet.`,
      story: [
        `At home there were deep vents under the harbour, red and warm and patient, and Ashka was the one who tended them. Halcyon put her in the Core Sump, the furnace at the bottom of everything that burns Aurelia's waste and heats Deepline from below. Subject 60. For a year, half of Deepline was warm because she was in pain.`,
        `The floor is never safe near her: Magma Glob, Lava Geyser, a Molten Wave, a Caldera that breaks out on both sides. Fumi, who runs the boilers above the Sump, heard her through the pipes and tapped back every night. When Pyra burned the Burn Ward, the fire ran down the vents to the Sump, and the two of them met inside it.`,
        `They have been sisters since. Dyna blew the Sump's door off, and has been allowed to watch every eruption since. When the whole floor goes up at once:`] },

    dyna: { realm: 'deep', quote: 0,
      origin: `Born on Vharra's steppe, the festival's fireworks girl. Torn through; woke in the Scrapworks.`,
      role: `Demolition artist of the Scrapworks`,
      look: `A grinning young woman with messy blonde hair under a yellow cap and goggles, a patched olive jacket crossed with bandoliers of round black bombs, a lit one in her hand.`,
      story: [
        `On Vharra, a girl with burnt eyebrows set a tube on the ground at the storm-season festival and the whole sky went gold. In Deepline she runs the Scrapworks, and every problem is a demolition job: Grenade, Proximity Mine, Rocket, and a Recoil Blast that throws her backwards across the room.`,
        `Mako was her first customer and is now her partner: she makes the bombs, he carries them in a suit of armour that can take the blast. She blew the door off the Core Sump for Ashka. She blows a hole in something for Bando most weeks, usually on purpose.`,
        `Jax at the Long Bar says she has no sense of timing. She has offered to show him a fuse. When the Carpet Bomb finishes and the dust settles:`] },

    bando: { realm: 'deep', quote: 0,
      origin: `Born on Vharra's steppe. Torn through; woke on Dockside Nine.`,
      role: `Dock hand of the Drowned Line`,
      look: `A lanky, grinning dock worker in a lime-green bandana and a teal work vest, forearms bandaged, one arm stretched impossibly long with the fist huge in front.`,
      story: [
        `Festival day on the steppe: a hundred kites, and one tangled in the only tree for a mile. A lanky boy looked at it and did not climb. He reached. The whole camp went quiet, then laughed until it could not stop. The kite belonged to a little girl called Sora, and Bando will tell you about it whether you ask or not.`,
        `Now he works Dockside Nine, the last wharf of the Drowned Line, where everything is out of reach except to him: Long Jab, Slingshot, Wind-Up, Reel In, Rubber Cannon. Dyna blows holes in walls for him; he reaches through them.`,
        `Tarek of the chain raiders claims a longer reach. Bando has invited him down to measure. Gale still owes him a kite. When the Hundred Hands come from every direction at once:`] },

    ferra: { realm: 'deep', quote: 2,
      origin: `Born on Vharra's steppe, in a smithy. Torn through; woke in the Crusher Yard.`,
      role: `Ruler of the Crusher Yard`,
      look: `A bright red mohawk, a steel-blue armoured jacket, one gauntlet red and one blue, and scrap metal and a saw blade orbiting her raised hand.`,
      story: [
        `On the night Ferra was born, every tool on the smithy wall turned to face the cradle. In Deepline, every piece of junk answers to her. She rules the Crusher Yard, where everything Aurelia throws away comes to rest, and she decides what is worth saving. One night, that was a white-haired boy under a car door.`,
        `Sawback, a Polarity that pulls and then pushes, a Scrap Halo, a Scrap Press, and a Junkyard Comet made of every loose piece of metal on the screen. Vex was her apprentice until he decided pull and push were the same thing and left to prove it. Mako's armour is built out of her scrap.`,
        `Through tunnels no map shows, she sends the best steel in Deepline up to a smith on the Surface called Garo. She has never seen his face. When the Junkyard Comet has come down:`] },

    sen: { realm: 'deep', quote: 0,
      origin: `Born on Vharra's steppe, at an old school of the blade. Torn through.`,
      role: `Master of the Rust Dojo`,
      look: `A calm swordsman with a black topknot, a white robe and a pink sash, a hand resting on a sheathed curved sword, eyes half closed, petals drifting past.`,
      story: [
        `In an old school on the steppe, a teacher gave him a square of white paper and asked for one line of ink. Sen waited so long she sat down. In autumn she threw leaves into the wind and told him to cut one; he cut the one about to land on her head, and she gave him her sword.`,
        `The tear dropped him in Deepline, and he made a dojo out of a rusted metro car: the cleanest room underground. Stand still a moment, then be done: Draw, Falling Leaf, Three Breaths, After the Bell. When Pell betrayed the Lantern Cell, Sable came to the Rust Dojo and asked to learn the Flash Step properly. Sen said nothing for a week. Then he taught her.`,
        `Isa, who drew lines beside him at that school, writes to him from the Archive. Noct is the only blade he has met that he could not see, and he means to see it once. When the Single Stroke arrives all at once:`] },

    rook: { realm: 'deep', quote: 0,
      origin: `Deepline-born, in the slums.`,
      role: `Hidden Clans, the Lantern Cell`,
      look: `Spiky dark teal hair under a charcoal headband with a small steel plate, a teal wrap jacket, a grin, and two see-through copies of himself stepping out behind him.`,
      story: [
        `Rook never fights alone, not even when he is alone. Every skill leaves a clone that fights beside him: Twin Rush, Swap Out, Pile-On, Wheel Toss. He was the loudest of the Lantern Cell, three Deepline kids the Hidden Clans trained in secret, with Sable and Moro.`,
        `Their sensei was a smiling man in a porcelain mask called Pell, who taught them everything about strings except whose hand held his. When Pell sold the Cell to Halcyon, Rook's clones held the door until the last one went up in smoke, and Rook came out of the smoke behind it. He has not forgiven Pell. He has not forgotten that Pell taught him the clones.`,
        `Kael is his brother from the slums; Kiri, with her paper double, is the only one who really gets him. Rue copied his clones once, and for a week there were far too many Rooks. When A Thousand Rooks pile on:`] },

    sable: { realm: 'deep', quote: 2,
      origin: `Deepline-born, under the Skylift's roots.`,
      role: `Hidden Clans, the Lantern Cell`,
      look: `Long black hair, a dark violet scarf pulled up over her nose and mouth, a dark indigo bodysuit, a reversed knife in one hand and violet lightning crackling round the other.`,
      story: [
        `Quiet, until the air starts to hum. Then it is already over. Sable was the second of the Lantern Cell, the one who never spoke at lessons and always finished first. Spark Kunai, Flash Step, Thunder Pierce, Storm Call: every skill hit builds static, and the static has to go somewhere.`,
        `When Pell betrayed the Cell, she ran with Moro while Rook held the door, and she has been running at Pell ever since. She learned the true Flash Step in Sen's Rust Dojo: a week of silence for one lesson. It was worth it.`,
        `Then a kid from the trash heap started throwing lightning round the slums, loudly, and Sable decided Deepline had one thunder too many. Kael disagrees. They are working it out in public. When the Thunderhead strikes everyone, again and again, then all at once:`] },

    moro: { realm: 'deep', quote: 0,
      origin: `Deepline-born, in the dark between the station lamps.`,
      role: `Hidden Clans, the Lantern Cell`,
      look: `A tired-looking young man with a small black topknot and a dark slate jacket, hands held calm, long shadows reaching out from beneath him like hands.`,
      story: [
        `He would rather not fight at all. He is very good at making it short. Moro was the third of the Lantern Cell, the one who fell asleep in lessons and still got the answers right. Shade Dart pins, Sink Step comes up behind you, Shadow Snare holds a whole room still.`,
        `When the Cell was sold, he and Sable ran through the dark while Rook held the door. He has carried Rook's guilt as well as his own ever since, because Rook is too loud to notice he has any. Pell taught him that shadows hide things. He decided they should hold things instead.`,
        `Vesper, the Subject who walks through shadows like doors, has been on his rooftops more than once. He finds it rude. When the Long Night puts the lights out over everyone:`] },

    pell: { realm: 'deep', quote: 2,
      origin: `Deepline-born. Nobody alive has seen his face.`,
      role: `Hidden Clans sensei, and the Director's spymaster`,
      look: `A thin man in a white porcelain mask and a plum coat, glowing pink threads running from every fingertip to a wooden marionette with blades for arms.`,
      story: [
        `He stands at the back and smiles. The thing in front of him does not. Pell was the Hidden Clans' teacher in Deepline, sensei of the Lantern Cell, and for ten years he was also the Director's spymaster. Nobody saw the strings until they were all pulled at once.`,
        `Puppet Lunge, Venom Mist, an Iron Cradle that shuts on you, Hundred Strings, Cat's Cradle. He took a little girl called Coda from Oda's temple and made her the star of the Noble Ring. He found a creature with no face in Halcyon's Blank Wing and taught her to wear anyone's. He sold Rook, Sable and Moro to Halcyon for a key to the Engine.`,
        `He told himself he was keeping the layers in balance. The Director told him the same thing. When the Grand Theatre closes in on everyone, he takes a bow nobody asked for:`] },

    thorne: { realm: 'deep', quote: 0,
      origin: `Deepline-born, in the catacombs.`,
      role: `Keeper of the catacombs`,
      look: `A pale, gaunt man with long white braided hair and a dark maroon coat, a sword grown out of white bone, sharp spurs along his forearms.`,
      story: [
        `Under the oldest part of Deepline lie the catacombs where the dead of the Ashfall War were laid, and Thorne keeps them as a garden. Everything he needs, he already carries inside: Finger Shards, a Spine Whip, a Bone Grove, a Marrow Lance. Anyone who hits him with a combo cuts themselves on him.`,
        `He is polite, patient and deeply unsettling. Vesna's Red Ledger keeps the debts of the living; Thorne keeps the debts of the dead, and between them they run the dark half of Deepline. Hex, the ghost girl from the Beyond, visits his garden because it is the only quiet place on the near side.`,
        `Every spring he sends cuttings to Ume of the Glowwild, as one gardener to another. She sends back pollen. When the Ossuary closes its ribs over everyone:`] },

    vex: { realm: 'deep', quote: 2,
      origin: `Deepline-born, in the Crusher Yard.`,
      role: `Owner of the yard across the tunnel`,
      look: `A stocky young man in a charcoal jacket over steel-plated forearms, one fist glowing red and the other pale blue, iron scraps floating between his hands.`,
      story: [
        `Opposites attract. He makes sure of it. Vex was Ferra's apprentice in the Crusher Yard until he worked out that pull and push are the same force pointed two ways, and decided he did not need a teacher who disagreed. He took his half of the scrap and set up across the tunnel.`,
        `Repel Shot throws you back, Attract drags you in, and the other charge within a breath snaps for more: Iron Storm, Lodestar, Flux Flip. To build his own yard he borrowed from Vesna's Red Ledger, and she has been collecting ever since.`,
        `Mako, whose magnets he tunes, is the only friend he kept from the Yard. Ferra pretends she does not watch his fights. When Magnetar throws everyone away and drags them back:`] },

    vesna: { realm: 'deep', quote: 0,
      origin: `Deepline-born, in the Red Quarter.`,
      role: `Keeper of the Red Ledger`,
      look: `A pale, elegant woman with dark crimson hair and a black and red coat, holding a scythe whose blade is liquid blood, drops floating upward round her.`,
      story: [
        `Everything has a price. Vesna pays it in red, and collects in red. She keeps the Red Ledger, the book of every debt in Deepline, and nobody has ever paid her late twice. Her skills cost her own blood and heal her for every hit: Blood Needle, Crimson Step, the Blood Moon Scythe, Hemorrhage, Red Rain.`,
        `Maren the Tide Doctor calls what she does a sickness. Vesna calls it bookkeeping. Thorne keeps the debts of the dead and she keeps the living's; they take tea together on Sundays. Vex owes her more than he will ever have.`,
        `What nobody in Deepline knows is that the Red Ledger has one page for Halcyon, and it is the longest. Vesna means to collect. When the Crimson Eclipse turns the moon red:`] },

    fumi: { realm: 'deep', quote: 2,
      origin: `Deepline-born, beside the boilers.`,
      role: `Boilerman above the Core Sump`,
      look: `A heavy-set man in a grey cloth mask and a grey work coat with brass valves on the shoulders, steam pouring from the valves and his clenched fists.`,
      story: [
        `Keeps it all in. Then does not. Fumi runs the boilers above the Core Sump that keep half of Deepline from freezing. Blocking and taking hits builds pressure, and when it is full his next skill vents: Steam Jet, Scald Step, Boiler Burst, Geyser Field, a Whistle that stuns.`,
        `For a year he heard someone in the pipes under his boilers, tapping. He tapped back. That was how he met Ashka, Subject 60, the furnace's prisoner, and it was the pressure in his pipes that helped blow her free. They are partners now: she burns, he boils.`,
        `He keeps Mako's suit from cooking its pilot, and with Nami he keeps the Drowned Line from rising. When Meltdown opens every valve at once:`] },

    mako: { realm: 'deep', quote: 1,
      origin: `Deepline-born, on the docks.`,
      role: `Dock hand in a suit of armour`,
      look: `A big man inside a bulky orange and grey mech suit, a cannon on one arm, a missile pod on the shoulder, his face showing through a glass visor.`,
      story: [
        `Built a suit of armour. Then kept building. Mako was a Deepline dock hand who got crushed under a crate once and decided never again. Every year the suit got bigger: Arm Cannon, Thruster Dash, Missile Pod, Ground Pound, Field Repair, and plating that soaks the first hits and rebuilds itself.`,
        `Ferra sells him scrap at a family discount. Vex tunes his magnets. Fumi keeps his boiler from cooking him. Dyna makes everything he fires, and she is the only one he lets ride on his shoulders.`,
        `He is gentle out of the suit. Inside it, he is the closest thing Deepline has to a tank. When the Full Barrage ends with a shell the size of a car:`] },

    nami: { realm: 'deep', quote: 0,
      origin: `Deepline-born, on the Drowned Line.`,
      role: `Warden of the flooded tunnels`,
      look: `A tall, pale woman with grey-blue skin and messy navy hair, a deep blue coat, and a huge broad cleaver with a sea-blue edge, water dripping from blade and hair.`,
      story: [
        `The sea took her once. She came back with its patience. Nami worked the Drowned Line, the flooded tunnels at the bottom of Deepline, until a wall gave way and the water closed over her. She was under longer than anyone survives. Maren pulled her out, and argued with the sea until it gave her back.`,
        `She came up grey and cold, with the Line still in her: Water Bullet, Mist Veil, a Riptide Eel, Bubble Jail, Rising Geyser, and every skill hit drinks some of the enemy's strength. She keeps the Drowned Line now, with Fumi's pumps and a large, friendly puddle called Slick who followed her home.`,
        `She owes Maren her life, and pays it back by guarding the doctor on every trip underground. When the Abyss Tide floods the arena and comes down:`] }
  });
})();
