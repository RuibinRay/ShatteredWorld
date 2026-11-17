'use strict';
// Shattered Worlds - Hero Stories, the realm of THE SURFACE (the Land). Data only; see js/lore/sky.js for the shape.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.realms.land = { id: 'land', name: 'THE SURFACE', sub: 'The Land', col: '#e0874a', hi: '#ffd8b8',
    desc: `What the war left between the sky and the tunnels: dunes, the poisoned Glowwild, the Crater and its Glass Sea, and pieces of Vharra's steppe that fell out of the tear and kept growing grass. Nobody rules the Surface. Plenty have tried. The Hidden Clans keep their village here, on a mountain no map shows.` };
  L.order.push('land');

  Object.assign(L.heroes, {
    fenn: { realm: 'land', quote: 0,
      origin: `Born on Vharra's steppe, with the hunting clans. Torn through; woke in the Beast Pens.`,
      role: `Hunter of the wastes`,
      look: `A grey wolf-pelt hood over a shadowed face and glowing violet eyes, dark indigo armour, clawed steel gauntlets, and a snarling wolf made of violet lightning at his side.`,
      story: [
        `Fenn rode with the hunting clans of Vharra, and his lightning runs on four legs. When the sky over the steppe tore open, he whistled up his storm-wolf and set it between the tear and the camp. It did not run when he fell. He woke in Halcyon's Beast Pens, in a cage built for something larger.`,
        `He bit through it. Chain Bolt leaps between three foes, Thunderclap paralyses a ring of them, the Thunder Wolf hunts on its own. On his way up out of Deepline he found a kid with static in his hair and the old storm-eye of Vharra scratched on his jacket. Fenn has been Kael's older brother ever since, whether either of them asked.`,
        `On the Surface he hunts what Halcyon lets loose. Kova wants to be every beast at once; Fenn thinks one wolf is plenty. Brann is the only one who out-howls him. When the Pack Howl has run its course:`] },

    brakk: { realm: 'land', quote: 1,
      origin: `Born on Vharra, a Warden of the Standing Stones. Torn through; woke in Shaft Nine.`,
      role: `The Hidden village's gentle giant`,
      look: `A huge bald man with a bronze jaw plate, carved stone gauntlets and a harness of rock, and the head of a stone dragon rising over his shoulder.`,
      story: [
        `Brakk was a Warden of the Standing Stones, the one the children followed because his shadow was cool in summer. The tear dropped him in Shaft Nine, Halcyon's deepest mine, where they put a drill in his hands and told him to dig. He dug. Upward. Through four hundred metres of rock, until he came out on the Surface under a grey sky.`,
        `Slow to anger, slower to stop: Boulder Toss, a Quake that runs both ways, an Earth Dragon that ploughs forward, a Warden's Wall of bedrock. Old Hollis found him sitting on the mountain, sat down beside him, and taught him that a mountain can choose where it stands.`,
        `Taro wants to know which of them is harder to move; Brakk is happy to let him lose. Opal, whose crystals frighten everyone, rides on his shoulder when she is scared. When World Breaker cracks the ground open:`] },

    jax: { realm: 'land', quote: 0,
      origin: `Born on Vharra's steppe, raised at a card table. Torn through.`,
      role: `Keeper of the Long Bar at Mile Zero`,
      look: `Grey stubble under a wide-brimmed brown hat, a rust-red poncho over a dark shirt, and a six-shot revolver raised beside his face, still smoking.`,
      story: [
        `Jax keeps the Long Bar at Mile Zero, the last stop before the open wastes, where every road on the Surface starts and most of them end. He came through the tear with a revolver, a deck of cards and the memory of his grandmother laughing as she dealt him in.`,
        `Five to make a point, the sixth to end the conversation: Quick Shot, a Trick Shot that banks off four walls, Fan the Hammer, a Lucky Coin that sends five bullets hunting, and every sixth shot a Dead-Eye. Dyna says he is just a bomb with a slower fuse. Yara out-shoots him at a mile; he out-shoots her at ten paces.`,
        `Zara dealt at his table once, before the Skylift and the money. Neither talks about how that ended. Tarn starts every run from his porch. At High Noon, every enemy is marked and the bell tolls six times:`] },

    tarn: { realm: 'land', quote: 2,
      origin: `Born on Vharra's steppe, a message runner. Torn through.`,
      role: `Runner of the Surface post`,
      look: `A lean runner in a royal blue headband and a sleeveless running vest, forearms wrapped white, one knee raised high, blue streaks behind him.`,
      story: [
        `The steppe of Vharra, end to end, is forty days on a good horse. Tarn did it on foot in nineteen with a message in his shirt. When the sky tore and the tear moved east at a walking pace, he walked in front of it for nine hundred miles, shouting at every camp to run. At the edge of the steppe there was no more east. He turned and hit it.`,
        `Every hit lands harder than the last, for as long as he keeps hitting: Step Kick, Rising Knee, Hundred Paces, Thousand Miles. On the Surface he runs the post between the scattered towns, from Mile Zero to the Crater rim. He and Gale have raced eleven times. Ivo trains before dawn to keep up; Tarn has never told him he trains at night.`,
        `Fenn knew him on the steppe. Jax keeps his water cold. When everything he has ever walked lands in one punch, he jogs on the spot:`] },

    brann: { realm: 'land', quote: 1,
      origin: `Born in the far north of Vharra, in a long-house under the snow. Torn through.`,
      role: `Hermit of the northern rim`,
      look: `A huge bearded man in a fur-collared coat with a dark red sash, both fists raised, breath steaming, frost on his shoulders.`,
      story: [
        `In the north of Vharra there were bears that walked like men, and men who fought like bears. Brann is the last of either. He woke in Halcyon's Ice House and broke out by walking through the wall. Now he lives on the cold northern rim of the Surface, where nobody goes and nobody bothers him.`,
        `Hurt him, and find out why nobody does it twice: Maul, a Roar that knocks shots out of the air, a Landslide charge, a Bear Hug that squeezes three times. Kova followed him for a month begging to learn the bear; Brann said yes, on condition the boy stopped talking. Isolde says winter answers to her. Brann has invited her north to say that.`,
        `Fenn is the only man he lets hunt beside him. At home the children shouted his short name, and not because they were afraid. When the Last Winter falls four times:`] },

    dune: { realm: 'land', quote: 0,
      origin: `Surface-born, or Surface itself. Nobody is sure.`,
      role: `Guardian of the Buried Meridian`,
      look: `A tall, broad woman in a hooded sand-coloured cloak and veil, pale gold eyes glowing, thick ropes of sand streaming round her arms.`,
      story: [
        `Under the eastern dunes lies the Buried Meridian, a city that went down in the Ashfall War with its people still in it. Dune is its guardian. Some say she was one of them. Some say she is the sand they are buried in, standing up. She does not correct either.`,
        `Slow to start, slower to stop, and every hit she takes adds a layer of sand: Sand Lance, a Dune Grip that holds and squeezes, Sinking Sands, a Sand Maw that swallows. For years she fought Tarek's chain raiders, who dug the buried city for scrap to sell to Halcyon. Then Halcyon sent drills instead of buyers, and the two of them found they had the same enemy.`,
        `Opal's arrival from the Beyond turned half her desert into the Glass Sea, and Dune has not forgiven the glass. Hollis walks out to sit with her on the longest night of every year. When the Buried City rises over everyone and comes down:`] },

    hollis: { realm: 'land', quote: 2,
      origin: `Surface-born, old enough to remember the Ashfall War.`,
      role: `Elder of the Hidden Clans, keeper of the Pact`,
      look: `An old, heavy-set hermit with a long white beard and a moss-green headband, a dark green robe with a stone-grey sash, small rocks floating round his open palm.`,
      story: [
        `Hollis remembers the night after the Ashfall War, when the rich went up and the poor went down and a handful of families swore to live in all three layers at once. He wrote the Pact of the Hidden Clans by firelight while a young monk called Oda rang a bell over it. He has kept the Clans' mountain village ever since.`,
        `Moves like a mountain, hits like one: Mountain Palm, Mudslick, an Old Shell that calls a stone tortoise down, Boulder Fall, Stone Garden. Standing still gathers Stillness, and Hollis has stood still longer than anyone alive. He taught Brakk to choose where a mountain stands, and Ivo to wait for the dawn.`,
        `He walks into the desert to sit with Dune on the longest night. He and Oda still argue about the second line of the Pact. When the Elder Mountain stamps three times, he pats the nearest head:`] },

    ume: { realm: 'land', quote: 1,
      origin: `Surface-born, in the Glowwild.`,
      role: `Gardener of the Glowwild`,
      look: `Bright green hair in a bun with a violet flower pinned in it, a dark green gardener's jacket, flowers opening in her palm and a soft cloud of glowing spores.`,
      story: [
        `Everything Halcyon dumps ends up east, in the Glowwild, a forest that glows because it is poisoned. Ume grew up there, and decided that if the forest was going to be poison, it was going to be beautiful poison. Her garden is the loveliest thing on the Surface. Do not touch any of it.`,
        `Spore Puff drifts and stacks Blight, Vine Snap lifts, Bloom Field plants three surprises, a Corpse Flower snaps shut three times. When a starving swarm of bees came through the Beyond, Ume let them feed when nobody else would; their honey is now the only safe sweet thing in the Glowwild. Elixa buys her spores. Ume checks what for.`,
        `Thorne, who keeps a garden of bone under Deepline, sends her cuttings every spring with a polite note. She sends back something that blooms in his catacomb and makes him sneeze for a week. When Last Spring opens across the whole floor:`] },

    kova: { realm: 'land', quote: 2,
      origin: `Surface-born, found as a small boy in the Glowwild.`,
      role: `Wild child of the Glowwild`,
      look: `Shaggy red-orange hair, tiger-stripe tattoos, an eagle feather and a turtle-shell pendant, and the spirit shapes of a tiger, an eagle and a tortoise behind him.`,
      story: [
        `Kova was found in the Glowwild as a small boy and raised by whatever would have him: a tiger in the morning, an eagle by noon, a tortoise by night. He never learned to be only one thing. Each skill changes his form: the tiger hits harder, the eagle moves faster, the tortoise wears a shell nothing gets through.`,
        `Tiger Pounce, Eagle Dive, Tortoise Shell, and all Three Beasts at once. The one beast he could never catch was the bear, so he followed Brann north for a month until the old man agreed to teach him. Fenn calls him a show-off; Kova calls Fenn a one-trick wolf. They hunt together anyway, and both pretend not to enjoy it.`,
        `Hart guards the caravans that pass the Glowwild, and Kova guards Hart, though Hart has not noticed. When the Primal Parade rolls through as every beast at once:`] },

    hart: { realm: 'land', quote: 2,
      origin: `Surface-born, at Mile Zero.`,
      role: `Caravan guard of the long road`,
      look: `A calm young man in a green cap with a red band and a dark green coat, holding a very long spear on the diagonal, its tip glinting.`,
      story: [
        `Hart guards the caravans that cross the Surface from Mile Zero to the Crater rim, and he has one rule: keep your distance. He will keep it for you. When an enemy steps into his reach while he is not attacking, the spear thrusts by itself. He has not been surprised in nine years.`,
        `Long Thrust, a Pole Vault over the enemy, Hundred Thrusts, Skewer Rush, a Spear Throw that comes back. Yara argues that a bow reaches further. Hart argues that a bow has never stopped a charge. Tor, the shield at the head of every caravan, stopped arguing with either of them years ago.`,
        `Something follows his caravans through the Glowwild, and Hart leaves meat out for it without asking what it is. When A Thousand Spears rain down and one goes through everyone:`] },

    taro: { realm: 'land', quote: 2,
      origin: `Surface-born, in the Hidden village.`,
      role: `Champion of the village ring`,
      look: `A huge sumo wrestler with a black topknot and a golden belt, crouched with one leg raised, salt flying from his hand.`,
      story: [
        `In the Hidden Clans' mountain village there is a ring of packed earth, and in the ring there is Taro. He has stood in it since he was nine. In all that time nobody has pushed him out. Brakk came closest, and Brakk is a mountain.`,
        `You can push him. He would rather you did not. Palm Push walks forward, Grab and Throw goes through any guard, Shiko Stomp makes the floor jump, Belly Slam lands on you and Salt Toss leaves you blinking. Ivo spars with him every morning. Tor has been asking for years to settle which of them is the true wall.`,
        `Oda blesses his ring with the bell every spring. Taro bows to the bell, and to his opponents, and then to the floor they are lying on:`] },

    tarek: { realm: 'land', quote: 1,
      origin: `Surface-born, in the eastern wastes.`,
      role: `Chief of the chain raiders`,
      look: `A rangy man in a grey bandana and a brown leather vest with brass buckles, a short sickle in one hand and a long iron chain with a brass weight looping from the other.`,
      story: [
        `Tarek led the chain raiders of the eastern wastes: diggers, salvagers and thieves who hauled scrap out of the Buried Meridian and sold it to whoever was buying, usually Halcyon. He never has to come to you. You always come to him: Chain Lash reels you in, Hook Pull yanks you to his feet, Iron Cyclone clears a circle.`,
        `For years his raiders and Dune's sand fought over the buried city, and he lost more chains than he can count. Then Halcyon sent drills instead of buyers, and Tarek understood who would be buried next. He walked into the desert unarmed and offered Dune his chain. She took it. They still do not like each other.`,
        `Garo forged his sickle and keeps it sharp. Bando of Deepline claims a longer reach, in public. When the Chain Prison locks shut on everyone:`] },

    oda: { realm: 'land', quote: 1,
      origin: `Surface-born. Rang the bell over the Pact ninety-six years ago.`,
      role: `Monk of the Temple of the Last Toll`,
      look: `A broad, calm bald monk in an ochre robe, a small bronze temple bell hanging from a rope in one big hand, rings of sound rippling from it.`,
      story: [
        `Oda is a monk who took a vow of silence. The bell did not. He keeps the Temple of the Last Toll at the edge of the Hidden village, and the bell has rung there every dawn since he and Hollis made the Pact beneath it.`,
        `Toll Wave rolls out and grows; Bell Drop traps the nearest enemy and rings; Resonance strikes the floor three times; and a perfect block rings his own bell and resets everything. A small girl called Coda used to count the tolls with her feet. Oda watched a masked man take her up to the sky, and he has rung a little harder every morning since.`,
        `He blesses Taro's ring every spring. He and Hollis still argue about the Pact, which is impressive, since only one of them speaks. When the Last Toll hangs over the arena, the bell says it for him:`] },

    garo: { realm: 'land', quote: 0,
      origin: `Surface-born, in the Hidden village.`,
      role: `Smith and gatekeeper of the Hidden village`,
      look: `A huge armoured man in a dark steel helmet and grey plate, holding up a four-bladed shuriken as wide as his chest, sparks glancing off its edge.`,
      story: [
        `Garo is the smith of the Hidden village and the keeper of its gate. He forged his shuriken from a Halcyon drill bit the width of a door, and he throws it once and it hits you twice: Wheel Throw, Iron Guard, Grind Wheel, Meteor Wheel, Twin Wheels.`,
        `The best steel on the Surface comes up from Deepline, through tunnels no Halcyon map shows. Ferra sends it; Garo sends back food. Neither has ever seen the other's face, and each would die for the other. That is what the Pact was for.`,
        `He forged Tarek's sickle and Tor's shield, and he and Tor hold the gate together: one throws, one catches. When A Thousand Wheels cross the arena and one the size of a house comes down:`] },

    ivo: { realm: 'land', quote: 2,
      origin: `Surface-born, in a dust town below the mountain.`,
      role: `Hollis's student, up before dawn`,
      look: `A muscular martial artist with a black mohawk, a sleeveless black top, gold trousers and gold-wrapped fists, golden steam rising off his shoulders.`,
      story: [
        `Ivo trains every morning before dawn. It shows. He climbed to the Hidden village at fourteen and asked Hollis to teach him; Hollis told him to wait for the sunrise. He waited a year of sunrises, and then he was taught.`,
        `Every combo hit he lands takes time off his skills, so he simply never stops: Whirl Heel, Sky Kick, a Fist Storm of twelve punches in two seconds, Meteor Heel. Tarn runs the roads for a living, and Ivo means to catch him on foot. Lin of the Sky Clan calls his style loud. She has sealed him twice. He is working on it.`,
        `Taro spars with him every morning and has never once been moved. When the Seventh Breath lands from every side at once:`] },

    tor: { realm: 'land', quote: 2,
      origin: `Surface-born, in the Hidden village.`,
      role: `The gate's shield, and the caravans'`,
      look: `A tall, broad man in a steel-blue helmet and plate, a huge round shield held in front with arrows and shards bouncing off it.`,
      story: [
        `Nothing has ever got past Tor. Nothing is about to start now. He holds the gate of the Hidden village beside Garo, he walks at the head of Hart's caravans, and arrows simply bounce.`,
        `Shield Toss, Shield Bash, Bulwark Slam, a Phalanx that sends every shot back, Unbreakable. Garo forged the shield; Tor has never once dropped it. He has heard that in Aurelia there is a knight called Aldric who holds a line just as well, and he would like to see that for himself.`,
        `Taro thinks he is the immovable one. Brakk thinks they are both very loud. When the Last Stand rolls out wall after wall through everyone, he plants his feet:`] }
  });
})();
