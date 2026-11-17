'use strict';
// Shattered Worlds - The Hollow Crown (new story mode): the card shown before each chapter, for every hero:
// [chapter kind, place, what happens]. From the design (Shattered Worlds - New Story Mode.md, section 6). Data only.
(function () {
  const SG = window.SW.saga = window.SW.saga || {};
  SG.cards = {
    nyra: [
      ["Home","Med-Lab Sector 7","Subject 31 sings the cracked tank open and sees the Husks no one else can see."],
      ["Bond","Cryo Vault 9","Isolde teaches her to keep her voice low; Maren keeps her alive the night they run."],
      ["Rival","Kael, at the Crater","Shown \"Kael\" opening the Sump's vents on the labs, she hunts him - and duels a boy whose face she will later learn was stolen."],
      ["The Three-Layer War","the Siege of the Noble Ring","She leads the Subjects up from the wards while the Proving Hall turns."],
      ["The Big War","Vega, at Pylon Chamber Six","She sings to the falling star until Vega remembers the harbour that steered by her."],
      ["Finale","","Winter for the Convergence, which bottled her. \"Subject thirty-one. Free.\""]
    ],
    isolde: [
      ["Home","Cryo Vault 9","The eldest Subject, a falcon of ice, and glass she cannot stand."],
      ["Bond","Aldric","The captain of her harbour's wall guards her vault without knowing; she makes him know."],
      ["Rival","Brann, at the Ice House","Who does winter answer to? They settle it in the cold."],
      ["The Three-Layer War","the Siege of the Noble Ring","Her falcon carries the signal to rise."],
      ["The Big War","Corvin, at the Skyport","The crows that went for her bird come back by the thousand; she breaks the crown over the one she never forgave."],
      ["Finale","","\"My falcon never misses.\""]
    ],
    gale: [
      ["Home","the Vent Stacks","He falls to the bottom of the world and rides the updraft all the way back up."],
      ["Bond","Sora and Kiri","He finds his sister on the towers; the Paper Post is born."],
      ["Rival","Tarn, at Mile Zero","Race number twelve. Wind against road."],
      ["The Three-Layer War","the Siege of the Noble Ring","The Paper Post flies the plan to every ward."],
      ["The Big War","Mika, at the Skylift","She cuts the cables; he holds the cars up on the wind while Sora goes after her."],
      ["Finale","","The wind Itsuki calls is his. \"The wind picked me. Not you.\""]
    ],
    aldric: [
      ["Home","the Proving Hall","Subject 12, the Director's finest knight, guarding a wall that no longer exists."],
      ["Bond","Vesper","She takes him down to the feed lines and shows him the Husks."],
      ["Rival","Tor, at the Skyport","Two walls. Neither moves. Then both do, together."],
      ["The Three-Layer War","the Siege of the Noble Ring","He breaks his oath to the Director to keep the older one, and turns the knights around."],
      ["The Big War","Vega, at Pylon Chamber Six","He holds the floor of a falling city while Nyra reaches her."],
      ["Finale","","\"My oath is kept.\""]
    ],
    pyra: [
      ["Home","the Burn Ward","Six weeks as Halcyon's furnace. The seventh week, the bottle breaks."],
      ["Bond","Nyra and Ashka","She carries Nyra out through her own fire; the fire runs down to the Sump and finds a sister."],
      ["Rival","Kestra, at the Ballast Decks","Who is the real phoenix? Fight twelve."],
      ["The Three-Layer War","the Siege of the Noble Ring","She burns the Proving Hall's gates."],
      ["The Big War","Lux, at the Noble Ring","White light against red fire, until Lux remembers what light is for."],
      ["Finale","","The fire Itsuki calls is hers. \"Too hot for you?\""]
    ],
    yara: [
      ["Home","the Firing Gallery","A target a mile away that was never a ship."],
      ["Bond","Lux","Light on the string."],
      ["Rival","Hart, at the Rust Flats","Bow against spear, the bet finally settled."],
      ["The Three-Layer War","the Siege of the Noble Ring","One arrow down the length of the Ring."],
      ["The Big War","Lux, at the Noble Ring","The friend who gave her light turns it on her; she shoots the crown off Lux's head at a mile."],
      ["Finale","","\"Meridian. Your last light.\""]
    ],
    kiri: [
      ["Home","the Paper Shrine","She folds the wishes of the dead into a crane and flies up the Stacks."],
      ["Bond","Sora and Rook","The Paper Post; a friend who is also more than one person."],
      ["Rival","Rue, at the Paper Shrine","A copy of a copy. Rue cannot hold her shape."],
      ["The Three-Layer War","the Siege of the Noble Ring","A thousand cranes carry the Ring's secrets to every door."],
      ["The Big War","Corvin, at the Skyport","Paper against feathers in a dark sky."],
      ["Finale","","\"Folded and finished!\""]
    ],
    kestra: [
      ["Home","the Ballast Decks","The Sky Clan dances fire in the hot dark under the gold."],
      ["Bond","Lin","Clan-sister; the one who keeps the beams from catching."],
      ["Rival","Pyra, at the Ballast Decks","The phoenix question, again."],
      ["The Three-Layer War","the Siege of the Noble Ring","The undercroft rises through the floor of the Ring."],
      ["The Big War","Lux, at the Noble Ring","Fire moths into white light."],
      ["Finale","","\"Rise again? Not you.\""]
    ],
    sora: [
      ["Home","the Skyport","A kite the size of a sail and letters for anyone who pays in bread."],
      ["Bond","Gale and Kiri","Her brother finds her; the Paper Post."],
      ["Rival","Mika, above the Skyport","Who stays up longer."],
      ["The Three-Layer War","the Siege of the Noble Ring","She carries Coda's final dance to every tower."],
      ["The Big War","Mika, at the Skylift","The rival who never came down, now cutting the cables; Sora brings her down for the first time."],
      ["Finale","","\"Never touched the ground.\""]
    ],
    coda: [
      ["Home","the Noble Ring opera","The star of the Ring, with a string on every step."],
      ["Bond","Zara and Mika","A seat at the House Edge; a teacher who leaps without a net."],
      ["Rival","Pell, at the Noble Ring","She cuts her strings mid-dance."],
      ["The Three-Layer War","the Siege of the Noble Ring","She dances Pell's secrets out for every noble to read."],
      ["The Big War","Mika, at the Skylift","Her teacher, bound; Coda dances her free."],
      ["Finale","","\"And... curtain.\""]
    ],
    zara: [
      ["Home","the House Edge","The richest card room on the Noble Ring, quietly funding Deepline."],
      ["Bond","Lin","The bodyguard who is also the Sky Clan's eyes."],
      ["Rival","Jax, at the Long Bar","The old flame, across a table, armed."],
      ["The Three-Layer War","the Siege of the Noble Ring","She bets the House on the uprising."],
      ["The Big War","Corvin, at the Skyport","Luck against omen."],
      ["Finale","","\"The house always wins.\""]
    ],
    maren: [
      ["Home","the Hydro Ward","Subject 21, the doctor of all the other Subjects."],
      ["Bond","Nyra and Nami","She keeps one alive in a tank and pulls the other out of the sea."],
      ["Rival","Vesna, at the Neon Market","The doctor and the debt collector."],
      ["The Three-Layer War","the Siege of the Noble Ring","She holds the door while the Subjects run."],
      ["The Big War","Vega, at Pylon Chamber Six","Vega's body is breaking under a city's weight; Maren keeps her alive long enough to let go."],
      ["Finale","","\"Doctor's orders: rest.\""]
    ],
    elixa: [
      ["Home","the Burn Ward labs","Halcyon's brightest chemist and her second colour."],
      ["Bond","Ume","Glowwild spores for a cure."],
      ["Rival","Pyra, at the Burn Ward","Her result looks back at her."],
      ["The Three-Layer War","the Siege of the Noble Ring","She turns her serums against Halcyon."],
      ["The Big War","Lux, at the Noble Ring","A reaction no one has tried: light, bottled after all, for one moment."],
      ["Finale","","The cure for the Husks works on the Hollow Legion too. \"Results: conclusive.\""]
    ],
    isa: [
      ["Home","the Archive","Every law of the Director's, sealed in her ink."],
      ["Bond","Tessa and Lin","The last page of the Director's story, and a guard at the door."],
      ["Rival","Orin, at the Archive","Doors opened, doors slammed."],
      ["The Three-Layer War","the Siege of the Noble Ring","She writes the Final Word, unmaking every law the Director sealed."],
      ["The Big War","Vega, at Pylon Chamber Six","She writes the seal that holds the city while Vega lets go."],
      ["Finale","","\"Written, sealed, done.\""]
    ],
    lin: [
      ["Home","the Ballast Decks","The Sky Clan's open palm, the calmest person in Aurelia."],
      ["Bond","Kestra and Zara","A clan-sister and an employer who sees everyone."],
      ["Rival","Ivo, at the Hidden Village","Soft against loud; she seals him a third time."],
      ["The Three-Layer War","the Siege of the Noble Ring","She guards Isa's brush hand while the Final Word is written."],
      ["The Big War","Mika, at the Skylift","Every fifth strike seals; the crown cannot call through a sealed point."],
      ["Finale","","\"Breathe out.\""]
    ],
    vesper: [
      ["Home","the Night Ward","Subject 77, out most nights, lighting Aurelia's alleys."],
      ["Bond","Noct and Aldric","The watchman of her harbour's dark; a knight who needs to see."],
      ["Rival","Moro, on the Night Ward roofs","Shadows for hiding, shadows for walking."],
      ["The Three-Layer War","the Siege of the Noble Ring","She shows Aldric the Husks."],
      ["The Big War","Corvin, at the Skyport","He puts out the sun; she lights a lamp."],
      ["Finale","","Then she goes down to the threshold to stand by Noct. \"You never saw me.\""]
    ],
    fenn: [
      ["Home","the Beast Pens","He bites through a cage built for something larger and climbs to open sky."],
      ["Bond","Kael","A kid with Vharra's storm-eye on his jacket; big brother, uninvited."],
      ["Rival","Kova, in the Glowwild","One wolf against every beast."],
      ["The Three-Layer War","the Drills at the Buried Meridian","The storm-wolf leads the charge."],
      ["The Big War","Apis, in the Glowwild","The pack against the swarm."],
      ["Finale","","\"The hunt is over.\""]
    ],
    brakk: [
      ["Home","Shaft Nine","Handed a drill; he digs upward through four hundred metres of rock."],
      ["Bond","Hollis","A mountain can choose where it stands."],
      ["Rival","Taro, at the Village ring","The closest anyone ever came."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He stops a Halcyon drill with his hands."],
      ["The Big War","Opal, at the Glass Sea","The girl who rides on his shoulder, glassing the Surface. He carries her out a second time."],
      ["Finale","","The earth Itsuki calls is his. \"Stone remembers. Stone endures.\""]
    ],
    jax: [
      ["Home","the Long Bar at Mile Zero","Every road starts on his porch."],
      ["Bond","Tarn","The water is always cold."],
      ["Rival","Yara, at Mile Zero","Ten paces against a mile."],
      ["The Three-Layer War","the Drills at the Buried Meridian","Six shots, six drill-heads."],
      ["The Big War","Itsuki, in the Ash Dunes","He is beaten. Itsuki is the strongest thing he has ever seen."],
      ["Finale","","\"High noon, partner.\""]
    ],
    tarn: [
      ["Home","Mile Zero","The runner who walked in front of the tear for nine hundred miles."],
      ["Bond","Fenn and Jax","The steppe and the porch."],
      ["Rival","Ivo, at Mile Zero","Ivo finally catches him. Almost."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He carries word to every town on the Surface in one night."],
      ["The Big War","Itsuki, in the Ash Dunes","He is beaten, and runs the news to Ryo and Kael."],
      ["Finale","","\"Keep up next time.\""]
    ],
    brann: [
      ["Home","the Ice House","He walks through the wall and goes north."],
      ["Bond","Fenn and Kova","A hunter beside him; a student who must stop talking."],
      ["Rival","Isolde, at the Ice House","Whose winter."],
      ["The Three-Layer War","the Drills at the Buried Meridian","The north comes south."],
      ["The Big War","Itsuki, in the Ash Dunes","The last bear falls. He gets up. He falls again."],
      ["Finale","","\"Winter is mine.\""]
    ],
    dune: [
      ["Home","the Ash Dunes","Guardian of the Buried Meridian."],
      ["Bond","Hollis","The longest night, sitting in the sand together."],
      ["Rival","Tarek, at the Buried Meridian","The last fight before they share a chain."],
      ["The Three-Layer War","the Drills at the Buried Meridian","She takes Tarek's chain."],
      ["The Big War","Opal, at the Glass Sea","The girl who glassed her desert, glassing all of it now. For one night, Dune lets the glass help."],
      ["Finale","","\"Buried with the city.\""]
    ],
    hollis: [
      ["Home","the Hidden Village","The elder who wrote the Pact."],
      ["Bond","Brakk and Ivo","A mountain that walked; a boy who waited a year of sunrises."],
      ["Rival","Oda, at the Temple of the Last Toll","The second line of the Pact, argued at last with fists."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He crosses out \"three\" and writes \"four\"."],
      ["The Big War","Ryo, at the Tether Fields","The young man who keeps two sides in balance, tipped. Hollis frees him - and sends him after Itsuki."],
      ["Finale","","\"Rest, young one.\""]
    ],
    ume: [
      ["Home","the Glowwild","Beautiful poison."],
      ["Bond","Apis and Elixa","A starving swarm; spores for a cure."],
      ["Rival","Thorne, in the Glowwild","Gardener against gardener."],
      ["The Three-Layer War","the Drills at the Buried Meridian","The Glowwild blooms over Halcyon's drill camp."],
      ["The Big War","Apis, in the Glowwild","The swarm she fed, eating her forest."],
      ["Finale","","\"Beautiful, isn't it? Deadly too.\""]
    ],
    kova: [
      ["Home","the Glowwild","A tiger in the morning, an eagle by noon, a tortoise by night."],
      ["Bond","Brann and Hart","The bear he could not catch; the caravans he shadows."],
      ["Rival","Fenn, in the Glowwild","Every beast against one wolf."],
      ["The Three-Layer War","the Drills at the Buried Meridian","The Glowwild's beasts come with him."],
      ["The Big War","Apis, in the Glowwild","Claw, wing and shell against the swarm."],
      ["Finale","","\"Claw, wing and shell.\""]
    ],
    hart: [
      ["Home","the Rust Flats","The caravan road from Mile Zero to the Crater rim."],
      ["Bond","Tor and Kova","The shield in front; whatever follows behind."],
      ["Rival","Yara, at the Rust Flats","Reach decides."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He holds the column's front."],
      ["The Big War","Apis, in the Glowwild","A spear is a bad weapon against a swarm, until it is not."],
      ["Finale","","\"Reach decides everything.\""]
    ],
    taro: [
      ["Home","the Village ring","Unmoved since he was nine."],
      ["Bond","Ivo and Oda","A sparring partner every dawn; the bell before every bout."],
      ["Rival","Tor, at the Village ring","Which of them is the true wall."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He throws a Halcyon drill out of the ring."],
      ["The Big War","Ryo, at the Tether Fields","Balance against the immovable."],
      ["Finale","","\"Bow. Then leave.\""]
    ],
    tarek: [
      ["Home","the Sinkhole","Chain raiders digging the buried city for scrap."],
      ["Bond","Garo","The sickle, sharp again."],
      ["Rival","Bando, at Dockside Nine","Who has the longer reach."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He walks into the desert unarmed and offers Dune his chain."],
      ["The Big War","Opal, at the Glass Sea","A chain around the girl made of glass."],
      ["Finale","","\"No one escapes my reach.\""]
    ],
    oda: [
      ["Home","the Temple of the Last Toll","The bell has rung every dawn for ninety-six years."],
      ["Bond","Hollis and Taro","The Pact, and the ring."],
      ["Rival","Pell, at the Noble Ring","The masked man who took Coda from his temple."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He rings the bell three times, which he has never done."],
      ["The Big War","Ryo, at the Tether Fields","A bell rings through a crown."],
      ["Finale","","He breaks his vow for one word. \"Hear the bell? It's for you.\""]
    ],
    garo: [
      ["Home","the Village forge and gate","Steel from Deepline, food back down."],
      ["Bond","Ferra","A smith he has never seen, who would die for him."],
      ["Rival","Tor, at the Village gate","One throws, one catches; a spar that becomes a test."],
      ["The Three-Layer War","the Drills at the Buried Meridian","His wheel cuts the drill cables."],
      ["The Big War","Opal, at the Glass Sea","Iron against crystal."],
      ["Finale","","\"The wheel always returns.\""]
    ],
    ivo: [
      ["Home","the Hidden Village","Before dawn, every dawn."],
      ["Bond","Hollis and Taro","A teacher and a wall."],
      ["Rival","Lin, at the Hidden Village","Loud against soft; he lands one."],
      ["The Three-Layer War","the Drills at the Buried Meridian","Twelve punches a second on a drill-head."],
      ["The Big War","Itsuki, in the Ash Dunes","The first to face the strongest, and the first to fall."],
      ["Finale","","\"Iron never rests.\""]
    ],
    tor: [
      ["Home","the Village gate","Nothing has ever got past."],
      ["Bond","Garo and Hart","The forge behind him, the spear beside him."],
      ["Rival","Aldric, at the Skyport","Two walls, finally seeing it for themselves."],
      ["The Three-Layer War","the Drills at the Buried Meridian","He holds the column's flank."],
      ["The Big War","Ryo, at the Tether Fields","A wall holds while balance is restored."],
      ["Finale","","\"I am still standing.\""]
    ],
    kael: [
      ["Home","the Crusher Yard","Ferra finds him under a car door; the slum kids call him Sparks."],
      ["Bond","Rook and Fenn","A brother from the slums; a big brother from Vharra."],
      ["Rival","Nyra, at the Crater","Told she sold out the tunnels, he fights her under a violet sky."],
      ["The Three-Layer War","the Strings Cut","The Pit Arena, and the hunt for the face that wore his."],
      ["The Big War","Rue, at the Neon Market, then Itsuki, in the Ash Dunes","He breaks Rue's crown, then goes up to the Surface to stand beside Ryo against the strongest."],
      ["Finale","","The thunder Itsuki calls is his. \"Out of the trash, into the storm!\""]
    ],
    ashka: [
      ["Home","the Core Sump","Half of Deepline is warm because she is in pain."],
      ["Bond","Fumi and Pyra","A voice in the pipes; a fire that found her."],
      ["Rival","Pyra, at the Core Sump","They fight before they know each other."],
      ["The Three-Layer War","the Strings Cut","Dyna blows the Sump's door; Ashka walks out."],
      ["The Big War","Noct, at the Old Metro","He cuts every light; she is a light."],
      ["Finale","","\"The core burns hotter than you.\""]
    ],
    dyna: [
      ["Home","the Scrapworks","Every problem is a demolition job."],
      ["Bond","Mako and Ashka","A suit that can take the blast; a door worth blowing."],
      ["Rival","Jax, at the Scrapworks","She shows him a fuse."],
      ["The Three-Layer War","the Strings Cut","The Core Sump's door."],
      ["The Big War","Rue, at the Neon Market","Every face Rue wears, she blows the mask off."],
      ["Finale","","\"Boom. That's art.\""]
    ],
    bando: [
      ["Home","Dockside Nine","Everything is out of reach, except to him."],
      ["Bond","Dyna and Sora","Holes in walls; a kite he once saved."],
      ["Rival","Tarek, at Dockside Nine","The reach question, settled in public."],
      ["The Three-Layer War","the Strings Cut","He reaches into the Pit's rafters for Pell."],
      ["The Big War","Slick, at the Waterworks","He holds the flood back with both arms."],
      ["Finale","","\"Long arm of Deepline!\""]
    ],
    ferra: [
      ["Home","the Crusher Yard","She decides what is worth saving."],
      ["Bond","Garo","Steel up, food down."],
      ["Rival","Vex, at the Crusher Yard","Pull and push."],
      ["The Three-Layer War","the Strings Cut","Every piece of junk in Deepline answers her call to arms."],
      ["The Big War","Hex, at the Roots","Scrap against ghosts."],
      ["Finale","","She and Vex tear the Crown's loose metal away. \"I'll recycle what's left.\""]
    ],
    sen: [
      ["Home","the Rust Dojo","The cleanest room underground."],
      ["Bond","Sable and Isa","A student Pell sold; a classmate who writes."],
      ["Rival","Noct, at the Old Metro","The blade he cannot see. He loses."],
      ["The Three-Layer War","the Strings Cut","One line through the Cat's Cradle."],
      ["The Big War","Noct, at the Old Metro","The rematch. This time Sen sees the blade, and breaks the crown with one stroke."],
      ["Finale","","\"One stroke. Enough.\""]
    ],
    rook: [
      ["Home","the Deepline Slums","Never fights alone."],
      ["Bond","Kael and Kiri","A brother; a friend who is also two people."],
      ["Rival","Pell, at the Pit Arena","The sensei who taught him the clones and sold the Cell."],
      ["The Three-Layer War","the Strings Cut","A thousand Rooks hold the Pit while the Cell closes the net."],
      ["The Big War","Rue, at the Neon Market","She copied his clones once. He has more."],
      ["Finale","","\"There's always more of me!\""]
    ],
    sable: [
      ["Home","the Deepline Slums","Quiet until the air hums."],
      ["Bond","Sen","A week of silence for one lesson."],
      ["Rival","Kael, in the Slums","One thunder too many."],
      ["The Three-Layer War","the Strings Cut","She catches Pell at last."],
      ["The Big War","Noct, at the Old Metro","Faster than the flash, in the dark."],
      ["Finale","","\"My hand is the storm.\""]
    ],
    moro: [
      ["Home","the Old Metro","He would rather not fight at all."],
      ["Bond","Rook and Sable","He carries Rook's guilt for him."],
      ["Rival","Vesper, on the Night Ward roofs","His shadows, her doors."],
      ["The Three-Layer War","the Strings Cut","Shadows that hold, not hide."],
      ["The Big War","Noct, at the Old Metro","The dark against the dark."],
      ["Finale","","\"The long night begins.\""]
    ],
    pell: [
      ["Home","the Pit Arena","Sensei of the Lantern Cell, and the Director's spymaster."],
      ["Bond","Rue","He finds her in the Blank Wing and teaches her faces."],
      ["Rival","Rook, at the Pit Arena","His best student."],
      ["The Three-Layer War","the Strings Cut","Caught in his own Cat's Cradle - and he lets it hold him."],
      ["The Big War","Rue, at the Neon Market","The spy he made, Called. He cuts her strings himself."],
      ["Finale","","\"You danced beautifully.\""]
    ],
    thorne: [
      ["Home","the Rootways","The catacombs, kept as a garden of bone."],
      ["Bond","Vesna and Hex","Tea on Sundays; a ghost who likes the quiet."],
      ["Rival","Ume, at the Roots","Cuttings and pollen."],
      ["The Three-Layer War","the Strings Cut","The dead half of Deepline stands up for the living half."],
      ["The Big War","Hex, at the Roots","The ghost who visited his garden, waking his dead. He puts them back to sleep, one by one."],
      ["Finale","","\"Welcome to my garden.\""]
    ],
    vex: [
      ["Home","the Crusher Yard","The yard across the tunnel."],
      ["Bond","Mako","The only friend he kept."],
      ["Rival","Ferra, at the Crusher Yard","His old teacher."],
      ["The Three-Layer War","the Strings Cut","The Red Ledger calls his debt; he pays in iron."],
      ["The Big War","Hex, at the Roots","Push and pull against a curse that hits twice."],
      ["Finale","","\"Iron always comes home.\""]
    ],
    vesna: [
      ["Home","the Neon Market's Red Quarter","Every debt in Deepline."],
      ["Bond","Thorne","Tea on Sundays."],
      ["Rival","Maren, at the Neon Market","Sickness or bookkeeping."],
      ["The Three-Layer War","the Strings Cut","She opens the Red Ledger at Halcyon's page."],
      ["The Big War","Hex, at the Roots","Blood against a ghost."],
      ["Finale","","\"Paid in full.\""]
    ],
    fumi: [
      ["Home","the Waterworks","The boilers above the Sump."],
      ["Bond","Ashka","Tapping on the pipes."],
      ["Rival","Mako, at the Waterworks","The suit's boiler, tested to bursting."],
      ["The Three-Layer War","the Strings Cut","The pressure that blows the Sump's door."],
      ["The Big War","Slick, at the Waterworks","The flood against the pumps."],
      ["Finale","","\"You pushed. I popped.\""]
    ],
    mako: [
      ["Home","Dockside Nine","Built a suit. Kept building."],
      ["Bond","Dyna, Ferra, Vex, Fumi","Everyone who keeps the suit alive."],
      ["Rival","Dyna, at the Scrapworks","The blast test."],
      ["The Three-Layer War","the Strings Cut","A walking tank in the Pit."],
      ["The Big War","Slick, at the Waterworks","The suit wades into the flood."],
      ["Finale","","\"Built to last.\""]
    ],
    nami: [
      ["Home","the Drowned Line","The sea took her once."],
      ["Bond","Maren and Fumi","The doctor who argued with the sea; the pumps."],
      ["Rival","Slick, at the Drowned Line","She steps in him, wins, and says sorry; he follows her home."],
      ["The Three-Layer War","the Strings Cut","The Drowned Line rises against Halcyon's drills."],
      ["The Big War","Slick, at the Waterworks","The friend who followed her home, flooding it. She says sorry again, and the crown breaks."],
      ["Finale","","The water Itsuki calls is hers. \"Sink to the abyss.\""]
    ],
    convergence: [
      ["Home","the Halcyon Spire","Director Calder Sayle orders the Engine to full power."],
      ["Bond","Pell and Rue","His hands and his faces."],
      ["Rival","Aldric, at the Proving Hall","His finest knight turns on him."],
      ["The Three-Layer War","the Spire","He steps into the Engine and becomes the Convergence."],
      ["The Big War","Vael","He opens the door and makes his bargain with the Sovereign."],
      ["Finale","","At the end he turns on Vael, the last engine eating the other - and loses to all of them. \"You were always fuel.\""]
    ],
    vega: [
      ["Home","Pylon Chamber Six","For a year, a city falls toward her and never lands."],
      ["Bond","Tessa and Lux","The ending where she lets go; the only kind star."],
      ["Rival","the Convergence, at Pylon Chamber Six","She refuses to hold his city."],
      ["The Three-Layer War","the Spire","She catches Aurelia when Halcyon cuts the pylons."],
      ["The Big War","Called to the Sky","Vael sends her to let Aurelia fall. Nyra, Aldric, Maren and Isa reach her; Tessa tells her the ending again."],
      ["Finale","","She and Lux hold the city in the sky while everyone crosses. \"Feel the weight of the stars.\""]
    ],
    tessa: [
      ["Home","the Archive","She has lived this year many times."],
      ["Bond","Vega and Isa","The ending she keeps to herself; the scholar she shows it to."],
      ["Rival","Corvin, at the Archive","Omens against tide tables."],
      ["The Three-Layer War","the Crater","She rewinds the duel that always ended with one of them dead."],
      ["The Big War","she does not answer the Call","She goes to Pylon Chamber Six and talks Vega down."],
      ["Finale","","She holds the last moment still. \"I've seen this ending before.\""]
    ],
    orin: [
      ["Home","Platform Zero","Caught stepping out of nothing; not caught for long."],
      ["Bond","Mira and Tessa","The only ones who can follow him."],
      ["Rival","Isa, at Platform Zero","Doors opened, doors slammed."],
      ["The Three-Layer War","the Near Side","He brings the Beyond-born out of the Blank Wing."],
      ["The Big War","he does not answer the Call","He finds the way to break it, and the door into the Crown."],
      ["Finale","","He opens it. \"Wrong door.\""]
    ],
    noct: [
      ["Home","the Blank Wing","Subject 00, the first thing that came back."],
      ["Bond","Vesper","The lamplighter of his harbour."],
      ["Rival","Sen, at the Old Metro","The swordsman who cannot see his blade."],
      ["The Three-Layer War","the Near Side","He walks out of a room with no shadows."],
      ["The Big War","Called to the Underground","Sent to cut every light in Deepline; Sen sees the blade at last, and the crown breaks."],
      ["Finale","","He stays on the threshold. \"There was no blade.\""]
    ],
    mira: [
      ["Home","the Observation Gallery","For her, glass was always a door."],
      ["Bond","Orin and Lux","Doors and light."],
      ["Rival","Rue, at the Observation Gallery","Reflection against copy."],
      ["The Three-Layer War","the Crater","She shows the false Kael his empty reflection."],
      ["The Big War","she does not answer the Call","A reflection answers no one."],
      ["Finale","","She shows Vael his own reflection: a crown with nothing inside. \"The reflection wins.\""]
    ],
    hex: [
      ["Home","the Rootways","Half a ghost, in the only quiet place on the near side."],
      ["Bond","Corvin and Thorne","A twin who worries; a gardener of the dead."],
      ["Rival","Rue, at the Rootways","Everything twice."],
      ["The Three-Layer War","the Near Side","Her dead world's warning, believed at last."],
      ["The Big War","Called to the Underground","Sent to wake Deepline's dead; Thorne puts them back to sleep and breaks her crown."],
      ["Finale","","\"Cursed from the start.\""]
    ],
    corvin: [
      ["Home","the Crater","Out of a dead world, with crows."],
      ["Bond","Hex","A twin he would give the last of his world for."],
      ["Rival","Isolde, at the Skyport","Eleven apologies."],
      ["The Three-Layer War","the Near Side","His crows see the Crown coming before anyone."],
      ["The Big War","Called to the Sky","Sent to put out the sun; Isolde's falcon breaks his crown."],
      ["Finale","","\"An omen, fulfilled.\""]
    ],
    rue: [
      ["Home","the Blank Wing","No face, no voice, no shape."],
      ["Bond","Pell","He taught her faces, and never asked for hers."],
      ["Rival","Kiri, at the Paper Shrine","A copy of a copy."],
      ["The Three-Layer War","the Crater","She wears Kael's and Nyra's faces, and the layers go to war. Then she runs, into the Drowned Line, where Slick asks what she looks like underneath."],
      ["The Big War","Called to the Underground","She wears Deepline's leaders' faces; Pell cuts her strings, and she keeps her own face."],
      ["Finale","","\"Seen it. Done it. Better.\""]
    ],
    opal: [
      ["Home","the Glass Sea","Half a mile of desert turned to crystal in one frightened night."],
      ["Bond","Lux and Brakk","A sister; a shoulder."],
      ["Rival","Dune, at the Glass Sea","The desert she glassed."],
      ["The Three-Layer War","the Drills at the Buried Meridian","Dune lets the glass help, for the first time."],
      ["The Big War","Called to the Surface","Sent to glass everything; Brakk carries her out a second time."],
      ["Finale","","\"Pretty. And broken.\""]
    ],
    lux: [
      ["Home","Med-Lab Sector 7","Light that would not bottle."],
      ["Bond","Mira and Yara","Glass that bends her; an archer she taught."],
      ["Rival","Yara, at the Firing Gallery","Light on the string, contested."],
      ["The Three-Layer War","the Near Side","She escapes the Med-Lab in a flash."],
      ["The Big War","Called to the Sky","Sent to burn the Noble Ring white; Yara shoots the crown off her head."],
      ["Finale","","She and Vega hold the city up. \"Light always finds a way.\""]
    ],
    slick: [
      ["Home","the Waterworks","A month of being stepped in."],
      ["Bond","Nami and Rue","The first person who said sorry; the one with no shape either."],
      ["Rival","Nami, at the Drowned Line","He loses, happily."],
      ["The Three-Layer War","the Near Side","He asks Rue what she looks like underneath."],
      ["The Big War","Called to the Underground","Sent to flood the Drowned Line; Nami says sorry again."],
      ["Finale","","\"You stepped in it.\""]
    ],
    apis: [
      ["Home","the Glowwild","A hive the size of a world, drunk dry; one swarm left."],
      ["Bond","Ume and Slick","A garden; honey from somewhere."],
      ["Rival","Kestra, in the Glowwild","Bees against moths."],
      ["The Three-Layer War","the Near Side","She warns everyone what an engine becomes. Nobody listens. Yet."],
      ["The Big War","Called to the Surface","The engine that ate her world calls her home; Ume's garden calls louder."],
      ["Finale","","\"Never poke a hive.\""]
    ],
    mika: [
      ["Home","the Crater","Through the rift with Ryo and Itsuki, from a world with two moons."],
      ["Bond","Ryo and Coda","Light and dark; a dancer learning to leap."],
      ["Rival","Sora, above the Skyport","Who stays up."],
      ["The Three-Layer War","the Near Side","She teaches Coda to leap without a net."],
      ["The Big War","Called to the Sky","Sent to cut the Skylift; Sora brings her down for the first time."],
      ["Finale","","\"Goodnight, under the full moon.\""]
    ],
    ryo: [
      ["Home","the Crater rim","A tear larger than any he and Itsuki have closed."],
      ["Bond","Itsuki, Mika and Hollis","A sworn brother, a companion, a man who kept three layers in balance."],
      ["Rival","Itsuki, at the Crater rim","Brothers spar; neither wins."],
      ["The Three-Layer War","the Near Side","He and Itsuki close the small tears while the layers fight."],
      ["The Big War","Called to the Surface","Hollis frees him at the Tether Fields; he goes straight to the Ash Dunes, where Itsuki is breaking the Surface."],
      ["Finale","","With Kael beside him, he brings his brother back. \"Balance restored.\""]
    ],
    itsuki: [
      ["Home","the Crater rim","Five elements, learned on five worlds; nothing on the near side can stand in front of him."],
      ["Bond","Ryo, Mika and Gale","A brother, a companion, and the best wind on this world (for a price)."],
      ["Rival","Kael, at the Old Metro","He challenges the thunder of this world on sight. They never finish."],
      ["The Three-Layer War","the Near Side","He tests himself against the best of each element: Pyra, Gale, Kael, Brakk, Nami."],
      ["The Big War","Called to the Surface, Vael's champion","He beats Ivo, Tarn, Jax and Brann in the Ash Dunes. Ryo and Kael together break his crown."],
      ["Finale","","He calls the Five Calamities with fire, wind, thunder, earth and water from the people who taught him, and strikes Vael's last blow. \"Five paths. One end.\""]
    ]
  };
})();
