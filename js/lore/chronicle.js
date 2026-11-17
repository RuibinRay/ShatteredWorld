'use strict';
// Shattered Worlds - Hero Stories, THE CHRONICLE: the full storyline of the 64 heroes. It is the story of the new story
// mode, The Hollow Crown (js/saga/, design in "Shattered Worlds - New Story Mode.md"): the three layers, Halcyon's
// Engine, the false faces and the war, and the invasion from the Beyond. Nobody in it has lost their memory.
// The Beyond-born are the villains: only the Director and Rue are here before Vael comes (design section 11).
// Each chapter: title, cast (hero ids shown as faces), paragraphs.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.chapters.push(
    { title: 'Prologue: Three Layers', cast: ['hollis', 'oda', 'garo', 'tor', 'taro', 'ivo'], text: [
      `In 2091 the Ashfall War burned the world in forty-one days. Afterwards the rich went up, to Aurelia, a city of gold towers floating on anti-gravity pylons. The poor went down, into the old metro lines, and called it Deepline. Everyone else was left on the Surface, with the dunes, the glass and the wind.`,
      `On the first night after the war, a handful of families met round a fire on a mountain and refused to choose. They swore the Pact of Three Layers: to live in the sky, on the ground and under it, all at once, and to keep the three from killing each other. A young monk named Oda rang a bell over the oath. A young hermit named Hollis wrote it down.`,
      `They became the Hidden Clans. Their village sits in a fold of the Surface mountains that no map shows. Garo keeps its forge and Tor its gate; Taro holds the ring where its children learn to fall; Ivo trains there every morning before the sun is up. Oda has not spoken a word since the night of the oath. He lets the bell talk.`
    ] },
    { title: '1. The Engine Turns', cast: ['convergence', 'rue', 'nyra', 'kael', 'isolde', 'fenn'], text: [
      `In 2187 Halcyon, the company that rules Aurelia, finished the Convergence Engine under its Spire. Dr. Veyra Kessen built it to keep the city in the sky. Director Calder Sayle ordered it to full power. Nobody else in the room argued.`,
      `It tore two worlds into ours. Vharra, the storm steppe, and the Frozen Harbour came through in pieces, and their people landed scattered across all three layers. They remembered everything: their names, their homes, the faces of the people they lost. They were refugees in a world that did not want them, and they knew exactly what had been taken.`,
      `The Engine tore one more hole, into the Beyond, the dark between worlds, and that hole never closed. Only one thing came through it then: a shape with no face, no voice and no name. Pell found it in the Blank Wing, called it Rue, and taught it to wear any face it was given.`,
      `Halcyon caught whoever had come through with power in them, numbered them as Subjects and drained them into the Engine. What was left was a Husk. And the Director, who listened to the Engine every night, began to hear something answering from the far side of the dark.`
    ] },
    { title: '2. The Subjects', cast: ['nyra', 'isolde', 'maren', 'pyra', 'elixa', 'aldric', 'vesper', 'yara'], text: [
      `In Med-Lab Sector 7, Subject 31 sang her tank open. Nyra was a tidesinger of the Frozen Harbour, and the first thing she saw outside the glass were the Husks no one else would look at. In Cryo Vault 9 the eldest Subject, Isolde, a falconer of ice, taught her to keep her voice low. Maren, a harbour doctor kept to patch up what the tests broke, kept her alive the night they ran.`,
      `In the Burn Ward, Pyra spent six weeks as Halcyon's furnace. In the seventh, the bottle broke. Elixa, Halcyon's own chief alchemist, who made the ward's serums, slipped her the cure for the sedatives and asked for nothing back. In the Firing Gallery, Yara was told to shoot at a target a mile away; it was never a ship.`,
      `Subject 12 was the Director's finest knight. Aldric had been captain of the Frozen Harbour's sea wall, and he guarded the Proving Hall as if the wall still stood. In the Night Ward a red scarf lit the lamps that nobody saw lit: Vesper, the harbour's lamplighter, who moved through Halcyon's halls one shadow at a time and counted the Husks in the feed lines.`
    ] },
    { title: '3. Under the Gold', cast: ['zara', 'coda', 'lin', 'kestra', 'isa', 'sora', 'gale', 'kiri'], text: [
      `On the Noble Ring, Zara's House Edge took the nobles' money every night and sent it down to Deepline every morning. Coda danced for the Director's guests at the opera with Pell's strings on every step, and smiled while she did it. Isa kept the Archive and read what Halcyon wrote about all of them.`,
      `Under the gold, in the Ballast Decks, the Sky Clan kept the Pact alive. Lin trained there in the dark between the counterweights; Kestra, who believes she is the true phoenix, burned there and told everyone so. Zara owed Lin her life, and paid in a currency nobody else could see.`,
      `Above it all flew the Paper Post. Gale fell to the bottom of the world in the Vent Stacks and rode the updraft back up. He found his sister Sora on the towers, and Kiri, a paper-folder from the Paper Shrine whose cranes carried letters Halcyon wanted unsent. Three kites and a promise: every letter arrives.`
    ] },
    { title: '4. The Wide Land', cast: ['jax', 'tarn', 'brann', 'dune', 'tarek', 'ume', 'kova', 'hart', 'fenn', 'brakk'], text: [
      `Mile Zero is where every road on the Surface starts, and the Long Bar sees all of them. Jax keeps a gun on the bar and a tab nobody pays. Tarn runs messages down roads no truck will take, and has raced Gale eleven times. In the Ice House, Brann, a hunter from Vharra's frozen north, keeps the winter in a building the desert keeps trying to melt.`,
      `In the Ash Dunes, Dune guards the Buried Meridian, a whole city under the sand, against Tarek's chain raiders, and Tarek wants what is under it as badly as she wants to keep it buried. In the Glowwild, Ume grows beautiful poison and Kova runs with the beasts; across the Glass Sea and the Tether Fields the caravans move under Hart's spear.`,
      `Two of Vharra's children landed on the Surface. Fenn, a beast-caller, broke out of Halcyon's Beast Pens with a storm-wolf at his heel. Brakk, the warden of a ring of standing stones, came up through Shaft Nine as if the rock had carried him. Hollis found Brakk sitting on a mountain and invited him in. Brakk said the mountain could come too.`
    ] },
    { title: '5. The City Under the City', cast: ['kael', 'ferra', 'rook', 'sable', 'moro', 'pell', 'vesna', 'sen', 'ashka', 'thorne'], text: [
      `A tear opened over Deepline's Crusher Yard and a boy fell out of a storm. Kael of Vharra, the thunder of the storm clans, landed in the trash, and Ferra, who decides what in the Yard is worth saving, decided he was. Halcyon's collectors came for him the same night. They left without him.`,
      `The Lantern Cell trained in secret under its sensei, Pell: Rook, who fights like a wall with fists; Sable, who listens to the dark; Moro, whose shadow does what he tells it. Pell taught them everything except who he reported to. In the Neon Market, Vesna's Red Ledger kept the debts of every soul in Deepline; the Pit Arena settled everything the Ledger could not.`,
      `Sen taught the sword in a rusted metro car and called it the Rust Dojo. Bando worked Dockside Nine, Dyna blew things up at the Scrapworks for a living, Mako walked the docks in a suit of armour, Vex ran a yard of iron that came home when it was called, and Fumi kept the pipes from bursting. Below them, in the Core Sump, Halcyon kept Ashka, a woman of the harbour's deep vents, and bled her heat into the city.`,
      `Lower still: the Waterworks and the Fungal Hollows, the flooded Drowned Line where Nami, who was born there, swims with things that should not be alive, and the catacombs where Thorne keeps a garden of bone and asks the dead how they are.`
    ] },
    { title: '6. The Faceless Spy', cast: ['rue', 'pell', 'convergence', 'kiri', 'sable'], text: [
      `Pell taught the Lantern Cell in Deepline and reported to the Director in the Spire, and nobody in either place knew about the other. His best tool was Rue. She could be anyone for a day: a guard, a noble, a girl from the Slums, a boy from the Crusher Yard.`,
      `Kiri met her first. In the Paper Shrine a folder of cranes came in with a face Kiri knew and a voice that was slightly wrong, and Kiri's cranes would not land on her. They fought among the paper, and Rue left wearing someone else.`,
      `By the time the Director needed a war, Rue had worn half of Deepline and half of Aurelia, and had never once worn her own face. She did not have one.`
    ] },
    { title: '7. False Faces', cast: ['rue', 'pell', 'kael', 'nyra', 'convergence', 'ashka'], text: [
      `The Director knew the three layers would turn on him together, so he made sure they turned on each other first. Rue put on Kael's face and opened the Core Sump's vents on Halcyon's labs; people died in those labs. Then she put on Nyra's face and led Halcyon's drills into the Deepline tunnels.`,
      `Each layer believed the other had attacked it. Aurelia saw a Deepline boy burn its labs. Deepline saw an escaped Subject sell its hideouts. The Surface saw drills coming down out of the sky. The war of the layers began exactly the way the Director wanted, and he watched it from the Spire with the Engine humming under his feet.`
    ] },
    { title: '8. The War of the Layers', cast: ['aldric', 'vesper', 'coda', 'dune', 'tarek', 'oda', 'rook', 'vesna', 'pell'], text: [
      `The Siege of the Noble Ring. The Proving Hall marched on the nobles. Vesper took Aldric down to the Engine's feed lines and showed him the Husks; Aldric broke his oath to the Director to keep the older one, and turned his knights around. Coda cut her strings in the middle of the opera and danced Pell's secrets out for every noble to read.`,
      `The Drills at the Buried Meridian. Halcyon's drills sank into the buried city and the Glass Sea. Dune and Tarek, enemies for years, ended up holding the same chain against them. In the mountains the Hidden Village rang Oda's bell three times, and the clans came down.`,
      `The Strings Cut. In the Pit Arena the Lantern Cell caught their own sensei in his own Cat's Cradle. Vesna opened the Red Ledger at its longest page, Halcyon's, and called in every debt at once. The Core Sump was broken open, and Ashka walked out of it carrying a year of stolen heat.`
    ] },
    { title: '9. Four Banners', cast: ['kael', 'nyra', 'pell', 'kiri', 'rue', 'hollis'], text: [
      `Kael and Nyra, each sure the other was a Halcyon agent, met at the Crater under a violet sky and fought. At the Pit, the Lantern Cell had caught Pell in his own Cat's Cradle, and Pell named the face behind the war: Rue. Kiri flew the word to the Crater. When "Kael" was seen in the crowd while the real Kael stood in front of Nyra, Rue ran.`,
      `Hollis took out the Pact of Three Layers and added a line under it: the Hidden Clans would no longer hide. Four banners went up the mountain road that night, Aurelia's, the Surface's, Deepline's and the Clans', and Oda rang the bell once.`
    ] },
    { title: '10. The Spire', cast: ['convergence', 'aldric', 'tor', 'yara', 'hart', 'sora', 'jax', 'isolde'], text: [
      `They climbed the Halcyon Spire from four sides at once. Tor and Hart held the gate. Yara shot the guns off the towers from a mile away. Jax took the lift. Sora flew the plan to every floor before the alarms knew there was a plan.`,
      `Halcyon cut the pylons to drop Aurelia on the attackers. Dr. Kessen rerouted them by hand from Pylon Chamber Six while Aldric held the chamber door against the Spire's guard. The whole city dropped one floor, groaned, and held.`,
      `On the floor of the Engine the heroes beat the Director. He stepped back into its light, and the Engine took him in. What came out was the Convergence. With the last of what was human in him, it did what he had wanted to do since the first test: it opened the Beyond all the way, and called.`
    ] },
    { title: '11. The Hollow Crown', cast: ['itsuki', 'vega', 'lux', 'mika', 'corvin', 'opal', 'apis', 'ryo', 'noct', 'rue'], text: [
      `The sky over the Crater split from horizon to horizon, and something the size of a city came down, shaped like a crown with nothing inside it. Sovereign Vael rules an empire of engines in the dark between worlds. His army is the Hollow Legion: hundreds of thousands of soldiers emptied out of the worlds he has eaten. The voice the Director heard in the Engine for a year was his.`,
      `The Convergence gave Vael the door; Vael promised it a throne over three worlds. Then Vael's champions came down: fourteen Beyond-born who serve him, each marked with his empty crown, and nobody in the three layers had ever seen them before. Rue sold herself to him the same night.`,
      `They struck all three layers at once. Vega came to let Aurelia fall, Lux to burn the Noble Ring white, Mira to turn the city's glass on it, Tessa to unwrite the Archive, Mika to cut the Skylift and Corvin to put out the sun. Opal turned the Surface to glass, Apis's swarm ate into the Glowwild and Ryo tipped the Tether Fields over. Noct cut Deepline's lights, Orin opened doors for the Legion, Rue wore the faces of its leaders, Slick flooded the pumps and Hex woke the dead.`,
      `Every layer fought on its own ground and nobody could come to help anybody else. Nyra, Aldric and Maren held Pylon Chamber Six; Pyra and Yara the Noble Ring; Isolde, Kiri, Zara and Vesper the Skyport. Brakk and Dune stood on the Glass Sea, Fenn and Ume in the Glowwild, Hollis and Oda on the Tether Fields. Sen, Ashka and Sable kept a light burning in the Old Metro, Pell met Rue in the Neon Market, Nami met Slick at the Waterworks and Thorne met Hex in the Roots. One by one, the champions fell back to the Crown.`
    ] },
    { title: '12. Over the Crater', cast: ['itsuki', 'kael', 'ivo', 'tarn', 'jax', 'brann', 'nyra', 'pyra', 'brakk', 'sen'], text: [
      `Itsuki is the strongest fighter in any world, and Vael sent him at the Surface's heart. In the Ash Dunes he beat Ivo, then Tarn, then Jax, then Brann. Kael came up from Deepline and held him longer than anyone, and lost too. Nobody stopped him. Itsuki looked at the five of them in the sand, turned, and walked back to stand under the Crown and wait.`,
      `So the three layers came to the Crater together, every hero who could still stand. The Legion poured down out of the crown-ship. Itsuki was waiting at the foot of it, calm, the five elements turning around him, the last champion between them and Vael. They went through him, and it was the hardest fight any of them ever had.`,
      `Inside, the Convergence and Vael fought side by side, the last two engines. The Convergence came apart into light, and the heroes of the three layers broke Sovereign Vael on the floor of his own crown. The crown-ship fell into the Crater, the door to the Beyond slammed shut, and it pulled the Legion and every champion back through with it. Itsuki was the last to go. He did not look back.`
    ] },
    { title: 'Epilogue: Together', cast: ['oda', 'hollis', 'aldric', 'fenn', 'nyra', 'kael'], text: [
      `Kessen turned the Engine backwards, once, and sealed what was left of the door.`,
      `Aurelia settled onto the Surface over a year, one floor at a time. The torn-through who wanted to go home to Vharra and the Frozen Harbour could, and some did; Fenn's storm-wolf ran ahead of him into the steppe and waited at the edge to see if he would follow. Most stayed.`,
      `Oda rang the bell once, and broke his vow of silence to say one word over the Pact. Hollis says the word was "together". Oda is not saying.`
    ] }
  );
})();
