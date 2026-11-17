'use strict';
// Shattered Worlds - Hero Stories, the realm of AURELIA (the Sky). Data only; the screen is js/lore/screen.js.
// Every hero of the 64 belongs to one of four realms: Aurelia (sky), the Surface (land), Deepline (underground)
// and the Beyond (not of this world). Each entry: realm, origin, role, look (from their splash art), story
// paragraphs (written from their look, moves and finisher lines) and quote = index into SW.finisherLines[id].
// Plain ASCII only: the pixel font has no em dash, curly quotes or ellipsis character.
(function () {
  const SW = window.SW, L = SW.lore = SW.lore || { realms: {}, order: [], heroes: {}, ties: [], chapters: [] };

  L.realms.sky = { id: 'sky', name: 'AURELIA', sub: 'The Sky', col: '#d9b45a', hi: '#fff0c0',
    desc: `A city of gold towers on anti-gravity pylons, built for the rich who fled the Ashfall War. The Noble Ring, the Spire, the Archive - and under it all, Halcyon's laboratories, where the Engine is fed. Aurelia is running out of power. It will not fall quietly.` };
  L.order.push('sky');

  Object.assign(L.heroes, {
    nyra: { realm: 'sky', quote: 2,
      origin: `Born by the Frozen Harbour. Torn through; woke in a Halcyon test tank.`,
      role: `Halcyon Subject 31, escaped`,
      look: `Long dark-blue braid, a pale test-subject suit with gold trim, and a slender blade of ice that hums when she breathes.`,
      story: [
        `She woke in a cracked tank in Med-Lab Sector 7 with a number instead of a name, and the first thing she saw was a Husk standing over the doctor: a grey shape nobody else in the room could see. Halcyon wanted to know why she could. She did not tell them.`,
        `Her power is Resonance, a note held so long the air gives up and freezes. Pulse Burst, Winterline, Shatterline: every one of them is singing, in the end. Isolde, two tanks down, taught her to keep her voice low. Maren kept her heart going on the nights the tests went too far. Pyra burned the way out.`,
        `Halcyon told her a Deepline boy called Kael had been sent to hunt the escaped Subjects. She believed it, for one fight. Now she sings for everyone the Engine ever bottled, and when the Last Verse lands she says it plainly:`] },

    isolde: { realm: 'sky', quote: 1,
      origin: `Born by the Frozen Harbour. Torn through; woke in Cryo Vault 9.`,
      role: `Halcyon Subject 52, the falconer`,
      look: `Silver-white hair, a deep blue high-collared coat, a crystal ice staff, and a small bird of glittering ice perched on her hand.`,
      story: [
        `In her world, Isolde kept the white falcons of the eyrie over the harbour. The tear took the eyrie, the harbour and the birds. It left her one falcon, made of ice now, and Cryo Vault 9, where Halcyon kept her colder than she had ever been. She did not mind the cold. She minded the glass.`,
        `She speaks softly and the air freezes to listen: Ice Shards, Frost Nova, an Ice Bird that hunts four at once. In the vault she was the eldest of the young Subjects, and she raised Nyra the only way she knew - the way a falconer raises a chick, by never once doing the flying for her.`,
        `Corvin's crows went for her bird on her first night free, and she has not forgiven a crow since. Brann thinks the winter is his; Isolde lets him think it. When her falcon stoops on the last one standing, she only smiles:`] },

    gale: { realm: 'sky', quote: 1,
      origin: `Born on Vharra's windy ridge. Torn through; fell to the bottom of Deepline.`,
      role: `Courier of the Paper Post`,
      look: `Windswept teal-green hair under a white headband, a pale green tunic with long flowing sashes, wind and leaves spiralling round his open hand.`,
      story: [
        `On Vharra, Gale ran the ridge where the wind never stops, and the kite clans said the wind loved him a little too much. The tear dropped him at the bottom of Deepline's Vent Stacks, a thousand metres under the sky. He fell down Stack Four and did not break. Then he found the updraft and rode it all the way back up.`,
        `He was looking for his little sister Sora, whose kite he had seen go up through the tear while he went down. He found her flying letters between the towers of Aurelia, and he has not let her out of his sight since, which she hates.`,
        `Wind Blade, Updraft, a Cyclone that juggles whole crowds, and when he is cornered he is simply never there. Tarn calls that cheating; Gale calls it wind. When the Hurricane drops, he grins at whoever is left on the floor:`] },

    aldric: { realm: 'sky', quote: 0,
      origin: `Born by the Frozen Harbour, where he captained the sea wall. Torn through.`,
      role: `Halcyon Subject 12, knight of the Proving Hall`,
      look: `A tall knight in dented steel plate, a closed helm whose visor slit glows pale gold, a dark red cape and a greatsword the length of a door.`,
      story: [
        `He was the captain of the harbour wall once, sworn to stand between the ice and the people behind it. The tear swallowed the wall and every soldier on it but him. Halcyon found him in the rubble, still on guard over nothing, and gave him a new wall to hold: the Proving Hall, where the Director's champions are made.`,
        `He fights slow and certain. Oathkeeper takes a blow and answers with the whole sword; Iron Tempest walks through anything; Judgment marks a foe and lets the sky decide. For a year he was the Director's finest knight, because he believed the Director's word that the Subjects were protected, not spent.`,
        `Then Vesper showed him the Husks in the Engine's feed lines. Aldric broke his oath to the Director that night, to keep the older one. Skysplitter falls three times, and he lowers the blade:`] },

    pyra: { realm: 'sky', quote: 0,
      origin: `Born by the Frozen Harbour, at a blue forge. Torn through; woke in the Burn Ward.`,
      role: `Halcyon Subject 44, the one who got away`,
      look: `Flame-orange hair tied back so it streams like fire, a dark crimson jacket with a gold emblem, burning forearms and a fireball in her open palm.`,
      story: [
        `At home there was a blue forge that never went out, and an old smith who called her in from the cold. Halcyon wanted to bottle that heat. Elixa mixed the serum, Pyra drank what she was told, and for six weeks the Burn Ward ran on her the way a furnace runs on coal.`,
        `On the seventh week the bottle broke. Pyra burned the Burn Ward to the frame, walked out through her own fire with Nyra on her back, and has been setting things alight ever since: Fireball, Flame Ring, a Sun Flare that eats walls, Forge Breath when she is really angry.`,
        `Ashka of the Core Sump is the only one who ever burned hotter, and the only one Pyra calls sister. Kestra insists she is the real phoenix; Pyra insists on fighting her about it. When the Supernova falls, she looks over the ashes and asks, sweetly:`] },

    yara: { realm: 'sky', quote: 2,
      origin: `Born by the Frozen Harbour, keeper of the sea-wall lamp. Torn through.`,
      role: `Halcyon Subject 57, the Firing Gallery's marksman`,
      look: `A long brown ponytail, a dark olive hunting jacket with a yellow sash, one eye closed over a tall pale longbow drawn to full stretch.`,
      story: [
        `Yara lit the lamp on the sea wall at home, so the ships in the ice could steer by her. In Aurelia, Halcyon gave her the Firing Gallery and a target a mile away and told her it was the same job. It was not. The ships she guided home did not fall down afterwards.`,
        `Her arrows hit harder the further they fly, so she stands very far back: Long Arrow, a Vault Shot that pins a man to the floor, Arrow Rain, a Sky Lance that comes down as light. Hart thinks distance is a spear's business; Jax thinks it is a pistol's. She has a running bet with both, and she is ahead.`,
        `Lux taught her to put light on the string. Now one arrow, drawn for a whole breath, runs the length of the world, and Yara lets it go like a lamp being lit:`] },

    kiri: { realm: 'sky', quote: 0,
      origin: `Born on Vharra's steppe. Torn through; woke in the Paper Shrine under Deepline.`,
      role: `Founder of the Paper Post`,
      look: `A high black bun pinned with a white paper charm, a cream wrap jacket with crimson cuffs and sash, and paper cranes swirling round her open palm.`,
      story: [
        `On a rainy day on the steppe a herder's daughter tore a page from the tally-book, folded it, and watched a bird stand up and look at her. Her father came in to find two daughters on the bed, and laughed until he had to sit down. Kiri has had a paper double ever since: whatever she does, it does again a moment later.`,
        `The tear dropped her in the Paper Shrine, where Deepline leaves folded wishes for the dead. She folded the wishes into one crane big enough to carry her, and flew it up the Vent Stacks: the first Deepliner to reach Aurelia without a ticket. With Sora and Gale she runs the Paper Post, carrying the letters Halcyon would rather nobody sent.`,
        `Rook likes her because she is also more than one person. Rue hates her, because a copy of a copy is no use to anyone. When the Paper Dragon has gone through everyone, both Kiris bow together:`] },

    kestra: { realm: 'sky', quote: 2,
      origin: `Aurelia-born, in the undercroft beneath the gold.`,
      role: `Hidden Clans, the Sky Clan's fire-fan`,
      look: `A long dark red ponytail, a dark crimson jacket with orange trim, and a great folding war fan with flames curling off its edge.`,
      story: [
        `Kestra is a daughter of the Sky Clan, one of the Hidden Clans that never chose a layer. Hers chose the undercroft of Aurelia, the hot dark beneath the gold where the pylons hum and the city's waste heat rises. Her family has danced the fire-fan there for a hundred years, out of sight of the nobles walking on their roof.`,
        `Fire first, then the fan to make it worse: Ember Breath sets them burning, Fan Gust blows the fire hotter, and burning enemies take her skills harder than anyone. When Phoenix Form wraps her, her Phoenix Dive comes down like a falling sun.`,
        `Then Pyra walked out of the Burn Ward wearing a phoenix of her own, and Kestra took it personally. Eleven fights; nobody agrees on the score. Her clan-sister Lin keeps them both from burning the undercroft down. When Sunfall lands, Kestra snaps the fan shut:`] },

    sora: { realm: 'sky', quote: 2,
      origin: `Born on Vharra's steppe, in the kite clans. Torn through - upward.`,
      role: `High flyer of the Paper Post`,
      look: `Spiky pink hair, a sky-blue jacket, hanging from the string of a white and blue kite the size of a sail.`,
      story: [
        `On the steppe of Vharra, Sora flew the biggest kite at the festival, and her big brother Gale held the other end. When the sky tore, the string snapped. Gale fell down. Sora went up, through the violet, and came out over the towers of Aurelia with nothing but a kite the size of a sail.`,
        `She has hardly come down since. She glides between the spires carrying letters for the Paper Post, cuts loose with the String Cut, bombs from the Kite Bomber, and lands only for the Dive Bomb, which nobody enjoys. Once, on festival day, a lanky boy reached across a whole field for her tangled kite. Bando still claims he saved her.`,
        `Mika is the only fighter who stays in the air longer, and Sora cannot stand it. When A Thousand Kites cut across the arena and fall, she waves from somewhere very high:`] },

    coda: { realm: 'sky', quote: 0,
      origin: `Surface-born, near the bell temple. Taken up to Aurelia as a child.`,
      role: `Star dancer of the Noble Ring's opera`,
      look: `Long violet hair, a pink and white dance outfit, mid-spin inside loops of long pink silk ribbon.`,
      story: [
        `Coda learned rhythm as a child from the bell of Oda's temple on the Surface, counting the tolls with her feet. Then a smiling man in a porcelain mask offered her a stage in the sky. Pell took her up to Aurelia, made her the star of the Noble Ring's opera, and tied a string to every step she took.`,
        `She danced for the Director's guests and carried their secrets back to Pell in her ribbons. She hated every bow. She hears music in every fight and fights on the beat: Ribbon Lash, Pirouette, a Grand Jete that throws the whole room up, a Spotlight that freezes her partner where she wants him.`,
        `Zara gave her a seat at the House Edge when she had nowhere else to sit; Mika taught her to leap without a net. The ribbons she fights with now are Pell's strings, cut one by one. When the Finale ends, she curtsies to an empty house:`] },

    zara: { realm: 'sky', quote: 0,
      origin: `Deepline-born. Won her way up the Skylift, one hand at a time.`,
      role: `Owner of the Noble Ring's richest card room`,
      look: `A short black top hat with a gold band, a dark red waistcoat, and a fan of white playing cards with gold edges drifting round her.`,
      story: [
        `Zara runs the House Edge, the richest card room on the Noble Ring, where Aurelia's nobles lose fortunes politely. She is not a noble. She was a Deepline card sharp who won her way up the Skylift one hand at a time, and she has never told anyone what she bet on the last one.`,
        `Every fight is a game of chance, and she stacked the deck: Card Toss draws from one to ten and a ten is a jackpot, House of Cards falls in four waves, a Wild Card might burn, freeze or heal. Lin stands behind her chair. The house's winnings go, quietly, down the Skylift to Deepline.`,
        `Jax knew her before the money. They do not discuss it, except across a table, armed. When All In comes down and the last card is the jackpot, as it always is, she tips her hat:`] },

    maren: { realm: 'sky', quote: 1,
      origin: `Born by the Frozen Harbour, the harbour's doctor. Torn through.`,
      role: `Halcyon Subject 21, doctor to the other Subjects`,
      look: `Long dark teal hair, a white healer's coat with sea-green sleeves, and a ribbon of sea water curling round her arm like a living whip.`,
      story: [
        `At home she was the doctor who sat with fevered children until the fever went out with the tide. Halcyon made her Subject 21 and then, because she was better at it than their own staff, the doctor of all the other Subjects. Maren took the job. It was the only way to stay in the room with them.`,
        `Her power takes and gives: Brine Lash, a Tide Pool that hurts her enemies and heals her, an Undertow that drags them back, a Brine Bubble that bursts and mends her. She kept Nyra's heart going through the worst of the tests. She pulled a drowned woman called Nami out of Deepline's flooded line and argued with the sea until it gave her back.`,
        `She knows exactly what Elixa's serums did, because she treated it. She knows what Vesna charges for blood, because she has seen the bill. When Spring Tide comes in four times and goes out again, she pulls off her gloves:`] },

    elixa: { realm: 'sky', quote: 1,
      origin: `Aurelia-born, Halcyon-trained.`,
      role: `Halcyon's chief alchemist, maker of the serums`,
      look: `A long purple braid, a white lab coat with violet trim, three bubbling flasks of red, blue and green, and coloured smoke everywhere.`,
      story: [
        `Elixa was Halcyon's brightest chemist and its most dangerous, because she never wanted anything except to know what happens next. She mixed the serums that woke the Subjects' powers. She did not ask where the Subjects came from. She asked what happens if you add a second colour.`,
        `Red Flask burns, Blue Flask freezes, the Green Cauldron eats; a new colour on a marked enemy sets off a reaction, and the Grand Experiment throws all three at once. Then Pyra burned her laboratory down around her, and for the first time Elixa saw one of her results look back at her.`,
        `She works with Ume now, buying Glowwild spores for a cure that might wake the Husks. Maren checks every flask. Pyra has not decided whether to forgive her. When the Magnum Opus rains down and everything reacts with everything, Elixa takes notes:`] },

    isa: { realm: 'sky', quote: 1,
      origin: `Born on Vharra's steppe, a scholar. Torn through; woke in Aurelia's Archive.`,
      role: `Seal-writer of the Archive`,
      look: `A black topknot, a white robe with a crimson sash, a long calligraphy brush, and ribbons of black ink and crimson glyphs curling round her.`,
      story: [
        `In an old school on the steppe there were two students who could draw a line nobody could cross: a quiet boy called Sen, and Isa. The tear dropped her in Aurelia's Archive, where Halcyon hired her to do what she did best. Every contract on the Noble Ring, every law of the Director's, was sealed in Isa's ink.`,
        `Every word she writes is a door she can slam: Ink Bolt leaves glyphs that burst underfoot, Brush Stroke cuts a wide arc, Seal Circle wakes and strikes four times, Binding Script holds a foe until every letter explodes. In the Archive she met Tessa, who had read the last page of everything. Tessa showed her the Director's.`,
        `Orin opens doors; Isa closes them, and they have argued about which is harder ever since. Lin guards her when she writes the dangerous ones. When the Final Word falls across the sky, she lifts the brush:`] },

    lin: { realm: 'sky', quote: 2,
      origin: `Aurelia-born, in the undercroft beneath the gold.`,
      role: `Hidden Clans, the Sky Clan's open palm`,
      look: `Long black hair, a white martial arts top and slate trousers, one open palm extended with rings of air rippling out of it.`,
      story: [
        `Lin is a daughter of the Sky Clan, like Kestra, and the calmest person in Aurelia. She does not hit hard. She hits exactly: every fifth strike seals a pressure point, and the enemy forgets how to use their own power for a moment. She has never needed a sixth.`,
        `Zara hired her to stand behind a card table. She took the job because the House Edge sees everyone on the Noble Ring, and the Sky Clan wanted eyes there. Air Palm, a Turning Wall nothing can touch, Palm Rain, Heart Strike. Ivo, who trains on the Surface, calls her style soft. She has sealed him twice to make a point.`,
        `She keeps Kestra's fire off the undercroft's beams and Isa's brush hand safe while it writes. When the Hundred Palms close on everyone at once, she lets out her breath:`] },

    vesper: { realm: 'sky', quote: 1,
      origin: `Born by the Frozen Harbour, the lamplighter of the sea wall. Torn through.`,
      role: `Halcyon Subject 77, of the Night Ward`,
      look: `A slim figure wrapped in dark navy cloth with only the eyes showing, a long crimson scarf, a short blade in a reverse grip and stars between her fingers.`,
      story: [
        `At home, every lamp on the sea wall came alight at dusk and nobody saw who lit them: only a red scarf against the snow, already at the next lamp. Halcyon locked Vesper in the Night Ward and numbered her 77. She left most nights anyway, and Aurelia's lower alleys began to have lamps in them.`,
        `You only see the scarf. Star Volley, a Smoke Step behind you, a Phantom Rush through everyone, a Pinned Shadow that nails you to the floor. Noct kept the same harbour in the dark: she lit it, he kept it clean. They found each other again in Halcyon's halls without a word.`,
        `Moro thinks shadows are for hiding; Vesper thinks they are for walking through. It was Vesper who took Aldric down to the feed lines and showed him the Husks. When the Thousand Cuts have landed, she is already at the next lamp:`] }
  });
})();
