# Shattered Worlds

A side-view 2D pixel open-world action RPG, built from the Shattered Worlds GDD.
Two heroes wake with no memories in a post-nuclear cyberpunk Earth stacked in three layers
(Aurelia in the sky, the Surface, Deepline underground) and fight to get their powers and their way home back.

This is the **first playable build: Act 1 for both heroes** (the GDD's vertical slice, plus the second hero).

## Play

**Play in the browser: https://ruibinray.github.io/ShatteredWorld/** (GitHub Pages, deployed from `main`).

Or open `index.html` in a browser. No install, no build step.

(Optional local server: `powershell -ExecutionPolicy Bypass -File tools/serve.ps1`, then http://localhost:8765)

## Controls (Bleach-vs-Naruto style)

| Key | Action |
|---|---|
| A / D | Move |
| K | Jump (hold for height; again in mid-air once unlocked). S + K drops through ledges |
| J | Attack: 4-hit combo. W + J launcher (then K to follow), S + J sweep |
| L | Dash (brief invulnerability, works in mid-air). L while launched = air recovery |
| S + L / W + L | Slipstep: intangible blink through a foe / upward. 60 energy. Works while being hit |
| S (hold) | Guard (blocks 80%, drains energy). Guard at the last moment = perfect guard |
| J + K (hold) | Charge energy |
| U | Skill, 25 energy. W + U aimed up, S + U alternate skill. Cancels out of a combo |
| I | Special, 50 energy. **S + I: each hero's big skill, 100 energy.** W + I ultimate (full bar, or one bar while awakened) |
| O | Awakening when the bar is full, otherwise call your assist (20 s cooldown). **S + O: the 10-second power mode** (it used to be on S + I) |
| Q / E / M / Esc | Heal item / interact / world map / menu |
| F9, F8, F7 | Debug: unlock every ability / warp to next zone / heal |

Gamepad: X attack, A jump, RB dash, Y skill, B special, RT awaken, LT guard, LB charge, Up interact.

Skills have cooldowns (U under a second, S + U and I a few seconds, S + I seven seconds); the four slots are shown under the health bar.

## Touch controls (`js/touch.js`)

On a phone or tablet the game shows a floating joystick (put a thumb down anywhere on the left half and drag) and action
buttons on the right. Each button carries the keyboard letter that the game's hints use (J attack, K jump, L dash, U skill,
I special, O awaken, J+K charge, E talk, Q item, M map, Esc menu) with the action's name in the current language. Down on
the joystick guards, up aims and climbs, exactly like S and W. Menus work with the joystick plus J (choose) and K (back).
The game fills the screen, the page cannot scroll or zoom, the first tap tries to go full screen, and a note asks to turn
the phone sideways while it is upright. Settings > Touch controls: Auto (on touchscreens), On, Off.
Not on touch: Player vs Player (two players need a keyboard) and typing the unlock code.

## Settings and languages (`js/settings.js`, `js/i18n.js`, `js/lang/`)

Title screen > **Settings**: Language (English, Español, 简体中文), touch controls, sound effects volume, music volume. In the story,
Esc > SYSTEM has a Language row too. The choices are kept in the browser (`shattered-worlds-settings-v1`), not in the save.

How it works: every piece of text the game shows goes through `SW.text` / `SW.textW` / `SW.wrap`, and `js/i18n.js`
looks the English up in the chosen language's dictionary there, so no game file needs changing to be translated.
Dictionaries are `js/lang/es.js` and `js/lang/zh.js` (only the chosen one is loaded). Spanish keeps the pixel font, which
now has á é í ó ú ü ñ ¿ ¡. Chinese uses the computer's own Chinese font, and while it is on the game is drawn at screen
resolution so the characters are sharp (pixel art looks the same). Text that has no translation stays in English.

Adding text or a language:
1. `tools/i18n-extract.ps1` lists every string in `js/*.js` into `tools/i18n/strings.json`.
2. New strings go into a batch file in `tools/i18n/src`, translations into `tools/i18n/out` (format in `tools/i18n-build.ps1`),
   or single fixes into `tools/i18n/extra.json`. `tools/i18n/STYLE.md` and `tools/i18n/glossary.json` keep names and tone
   consistent.
3. `tools/i18n-build.ps1` writes `js/lang/<id>.js`.
4. `tools/i18n-check.js` (in the browser console) walks every menu and conversation and lists what is still in English.
A new language needs an entry in the list at the top of `js/i18n.js`, and glyphs in `js/core.js` if it uses letters the
pixel font lacks (otherwise it is drawn with the system font, like Chinese).

## Difficulty (`js/difficulty.js`)

Chosen on the title screen (the Difficulty line: J or A / D to change) or in Esc > SYSTEM (the last row). It belongs to the
player, not to a save, and applies at once. Medium is the game as tuned. Ordinary enemies and bosses scale separately; during a
boss fight everything that hits you counts as boss damage. The Crater duel follows it too. Versus keeps its own bot levels.

| Level | Enemies: health / damage | Bosses: health / damage | Crater duel |
|---|---|---|---|
| Easy | 70% / 60% | 75% / 65% | Easy bot, half the rival's edge |
| Medium | 100% / 100% | 100% / 100% | as tuned |
| Hard | 125% / 125% | 120% / 115% | Normal bot, 1.3x the edge |
| Nightmare | 170% / 160% | 180% / 160% | Hard bot, 1.7x the edge |

Measured with the scripted players as Kael against Tusk, the Scrap Baron and the Glowmother: on Easy nobody dies; on Medium the
masher dies against the later bosses and the careful player wins; on Hard the masher always dies and the careful player wins most
fights (about half against the Glowmother, losing closely); on Nightmare the careful player dies about half the time or more.

**The first bosses are easier at every level.** Each hero's tutorial boss has 75% of its old health and 85% of its old damage,
so boss health now climbs through the story: the tutorial bosses (255 to 540 for the first fifteen heroes) come in below the Act 1
finale (Grist 620, Brandt 580), then Act 2 (640 to 960) and Act 3 (900 to 1400). The legends' tutorial bosses stay bigger (465 to 825)
because legends hit for +50%. At Medium a button-masher now usually beats a first boss; a careful player loses 8 to 52%.

**Later bosses are tuned for the level players really arrive at.** Working the XP through the story (every mission, every enemy
killed once, no secrets) gives these arrival levels on both roads; the first tuning had assumed the lower ones in brackets, and gave
the test players no stat points:

| Boss | Real arrival (first tuned at) | Health / damage now |
|---|---|---|
| Grist / Brandt (Act 1 end) | 5 / 4 (5 / 4) | 620 / 580, unchanged |
| Scrap Baron | 8-9 (7) | 989 / 18 |
| Glowmother | 10 (9) | 1056 / 18 |
| Anvil | 14 (12) | 1080 / 20 |
| Lord Castellan Vane | 17 (13) | 1250 / 21 |
| Prefect Quist | 19 (14) | 1260 / 15 |
| Dr. Morrow | 20-21 (15) | 1320 / 16 |
| Dr. Kessen's mech | 22 (15) | 1400 / 22 |
| The Director, 3 phases | 23 (16) | 1350 + 1650 + 1500 / 24, 24, 22 |

Re-measured at those levels with half the stat points in Power: the button-masher dies or ends near death against every one of
them, and the careful player wins losing about 20 to 55% (the Glowmother sometimes beats a careful Kael). The multipliers are in
`LATE` in `js/difficulty.js` and apply at every difficulty level. Arrival levels are lower for a player who skips fights and higher for
one who finds secrets or farms.

## Cyber mods (`js/mods.js`)

Esc > **MODS** (the seventh tab). Three mod slots, four once A3-1 is done. Mods are **crafted at any save point** (it is the
bench) and equipped or removed anywhere. They work in the story only, not in Versus.

Materials drop from foes: **scrap** from everything (1-2), **chips** from drones, gunners and shielded troops (40%) and from
anyone else (12%), **gel** from beasts and husks (40%), and from every boss 8 scrap, 2 chips, 2 gel and a **core**. A playthrough
gives roughly 200+ scrap, 40 chips, 25 gel and a dozen cores: enough for six to ten of the eighteen mods, so you choose.

| Mod | Effect | Recipe |
|---|---|---|
| Servo Fists | combo damage +10% | 18 scrap, 2 chips |
| Capacitor | skills and specials cost 15% less energy | 20 scrap, 3 chips |
| Flux Cell | energy regen and energy from hits +25% | 16 scrap, 2 chips, 1 gel |
| Ablative Plating | 10% less damage taken, 8% slower run | 24 scrap, 1 chip |
| Overclock | dash 15% faster and further, max HP -10% | 16 scrap, 2 chips |
| Reflex Chip | perfect-guard window 6 to 10 frames | 14 scrap, 3 chips |
| Static Skin | a foe hitting you up close takes 40% back | 18 scrap, 2 chips, 1 gel |
| Leech Coil | heal 1.5% of damage dealt | 16 scrap, 3 gel |
| Hearth Reactor | awakening heals 15% max HP | 14 scrap, 2 gel |
| Field Mender | healing items heal 65% instead of 40% | 12 scrap, 3 gel |
| Adrenal Pump | +25% damage below 30% HP | 14 scrap, 2 gel |
| Rad Filter | radiation builds half as fast; spikes and falls cost half the HP (free with the Act 2 caravan filter) | 10 scrap, 1 gel |
| Scrap Magnet | +30% creds and +1 scrap from foes | 10 scrap |
| Bounty Tag | +25% XP from foes | 12 scrap, 1 chip, 1 gel |
| Surge Core | awakening bar fills 30% faster | 20 scrap, 1 core |
| Prism Lens | specials, big skills and ultimates +15% | 24 scrap, 2 chips, 1 core |
| Ghost Step | dash cooldown -30%, longer dodge window | 20 scrap, 2 gel, 1 core |
| Second Wind | once per area (and per rest), a killing blow leaves 1 HP | 30 scrap, 2 cores |

Balance, measured with `ST.bench` (Baron and Glowmother, Kael and Nyra, 6 fights each) with Servo Fists, Ablative Plating and
Leech Coil equipped: the careful player's average loss went from about 45% to 27%, and the masher's deaths from 18 to 11 of 24.
Leech Coil was 5% at first; that erased nearly all boss damage, so it is 1.5%. To measure a loadout, set `mods.slots` in the
state `G.fresh` returns before running `ST.bench`. Recipes cost less scrap with Caravan standing (see below).

## Heat and factions (`js/heat.js`)

**Heat** (design document: "fighting in public raises Heat 1-5 stars; at 3 or more, elite patrols hunt you; hide in vents or
leave the zone to cool down"). It runs from the start of the assault on Aurelia (A3-2 done) until the ending, in the
**Skyport, the Noble Ring and the Spire**, and shows as stars on the HUD.
- A foe killed there adds 8 (4 inside a story fight, 3 for a patrol). Every 20 is a star, up to 5.
- It cools on its own after 8 calm seconds (no hits, no kills, no patrol within 220 px): about one star per 11 seconds.
  Changing area takes two stars off. A **maintenance vent** (two or three per area) hides you for 2.5 s and takes two stars
  off, but not while a foe is close; patrols farther away lose your trail.
- **3 stars:** elite patrols walk in from the edge of the screen (black-and-gold Halcyon Elites, Elite Enforcers, Hunter
  Drones), up to stars - 1 alive at once. They drop a chip half the time. **5 stars:** one **Halcyon Hunter**, a gold
  mini-boss (560 HP, never staggered). Beating it clears all Heat and drops a core, 2 chips and 6 scrap.
- Patrols never come during a story fight, a boss or the lift ride, so the story is not hijacked. The scripted Noble Ring run
  peaks at 1 star. After the Noble Ring and the Spire are won, a few Halcyon stragglers still walk them.

**Factions.** Esc > **FACTIONS** (the eighth tab). Standing runs from 0 to 100: Stranger, Known (15), Friend (40),
Trusted (70), Honoured (100). Halcyon is always hostile; its row shows your Heat.

| | Deepline Syndicates | Scrapton Free Caravans |
|---|---|---|
| From the story | 10 for the first Pit Arena win, 30 for Rally the Deep (A3-2) | 10 each for A2-2, A2-3, A3-1 and A3-3 |
| Also from | jobs (+12), Pit sparring wins (+3), beating a Hunter (+6) | jobs (+12) |
| Jobs board | the old notice board in the Neon Market | a new board in Scrapton, east of the bounty board |
| Always | Neon Market prices -1% per 5 standing (to -20%) | crafting scrap -1% per 5 standing (to -20%) |
| 40 | safe houses: resting at a save point in Aurelia clears Heat | jobs pay 50% more creds |
| 70 | smugglers: changing area clears all Heat | salvage rights: +1 scrap from every foe |
| 100 | jobs also pay a core | jobs also pay a core |

**Jobs**: one per faction at a time, taken and paid at that faction's board. Each one is "defeat N of a kind of foe" in an
area you have reached, and pays 60 creds, 6 scrap and 2 chips or gel, plus 12 standing. Caravan jobs: Crawler Cull, Bandit
Sweep, Raider Remnants, Glow Hunt, Lay the Husks to Rest. Syndicate jobs: Rat Catcher, Feral Pack, Sump Rivals, Pit Night
(win a sparring night) and Halcyon Bounty (Act 3). The board offers them in turn.

**Balance**, measured with the two scripted players at level 17-19 (Kael and Nyra, 3 fights each): a 4-star patrol costs the
careful player 13% and the masher 42% of their health; the Hunter costs both about 42%, with no deaths. The Elite Enforcer
was 190 HP / 19 damage at first and cost the masher 70% alone; it is 160 / 17. The Elite trooper blocks every fourth hit and
commits to its swings, because a plain trooper is stun-locked and does no damage.

## Side quests (`js/sidequests.js`)

The first four of the design document's ten side quests, given to the game's own cast (the document's versions use
characters from other series). Esc > **QUESTS** (the ninth tab) lists them; a **!** over someone means a quest to take,
**?** one to hand in.

| Quest | From | Opens | Task | Reward |
|---|---|---|---|---|
| Bun Run | Mags, Deepline Slums | after Act 1 | 5 hot buns to the Slum Kid, the Cartographer, Madame Quill, the Bookie (Pit) and Tamsin (Old Metro) in 100 s | max HP +20 for good, 50 creds |
| Arena Ladder | the Bookie, Pit Arena | first sparring win | 10 tiers, one fight each, healed first; tier 10 is Anvil (after the Grand Melee) | 40 creds x tier (a quarter on rematches), Syndicate +2, titles at 3 / 6 / 10, a core at 10 |
| Dry Wells | Wenna, east end of the Ash Dunes | after the Scrap Baron | fix 3 pumps (3 scrap each); each brings raiders (a Husk at night) | 250 creds, 2 gel, Caravan +10 |
| Odile's Patients | Odile, Scrapton | with the Glowwild filter | 6 glowcaps in the Glowwild (brighter at night) | healing items heal 15% more of max HP, 100 creds |

**Measured:**
- **Bun Run:** a clean run of the route takes the route bot about 55 s (24 s across the Slums, 10 s through the Market to the Pit, 5.5 s on to the Metro, 2 s to Tamsin, plus stops and screen changes), so the timer is 100 s.
- **Arena Ladder:** at each tier's recommended level, tiers 1-3 cost the test players 0-5%, tiers 4-9 about 15-50%, and tier 10 (Anvil) kills the masher and costs the careful player about 57%. Two Sump Gangers in one tier cost 70-80% (they shoot), so no tier has more than one.
- **Dry Wells:** each ambush costs 0-12% at level 9, with a street thug joining from the second pump. A gunner as the third attacker killed the test players. Ambushers spawn on the pump's own ground level; one once landed on an unreachable ledge and the job could not finish.
- **Placement:** every pump and glowcap is at least 3 tiles from any hero's secret spot (all 25 heroes checked).
- **Translation:** all text is translated (es, zh) through `tools/i18n/extra.json`; built from whole sentences and `{0}` templates so it translates.

## The Ember Ledger: the black market (`js/ledger.js`)

The design document's fourth faction: based in the Ash Dunes, hostile until a hidden quest after A2-2, paying in
black-market gear. (The document named it after a group from another series; the Ember Ledger is original.)
- **The hidden quest.** After the Scrap Baron falls, opening his strongbox turns up a burnt ledger page: somebody kept his
  books and wants to meet "at the wreck, after dark". An ember scratched on the Baron's old wreck lets you wait until 20:00.
  At night **Sable**, the Ledger's broker, is there. Her three **Ledger Collectors** think you work for Halcyon: beat them
  and the Ledger opens (standing 15). Until then Esc > FACTIONS shows it as `? ? ?`, then as HOSTILE.
- **The market**, only at night and only at the wreck: chips and gel for 40 creds, cores for 280, and four pieces of
  **black-market gear** that are bought, never crafted, and go in the cyber-mod slots:

| Gear | Effect | Price | Standing |
|---|---|---|---|
| Ghost Tag | Heat rises 40% slower | 250 | 15 |
| Night Eyes | +15% damage at night, and the dark is lighter | 400 | 40 |
| Lead Lining | radiation builds 25% slower and drains half as much | 350 | 40 |
| Ember Heart | every non-boss kill heals 3% of max HP | 700 + 1 core | 70 |

- **Standing**: prices fall 1% per 5 standing (to -20%); +5 for each piece of gear bought; +12 per Ledger job (Cut-Throat
  Competition, Night Work, Glass Harvest, Halcyon Salvage), which Sable hands out ("Work"); at 100 their jobs pay a core.
- **Balance**: the Collectors were plain bandits at first (70 HP): three were over in 8 s for 0-4% health. With 85 HP,
  13 damage, committed swings and a block every third hit they cost the careful test player 15-32% in about 10 s at level 9.
  The first measurement (53% lost) turned out to be night Husks rising into the fight; Husks no longer rise during it.

## Day/night and radiation (`js/daynight.js`)

**Day/night** (design document: "20 real minutes per day; Husks spawn only at night"). The clock runs while you play
(dialogue, menus and cutscenes stop it), starts at 08:00 in a new story, is kept in the save, and shows on the HUD next to the health
panel (sun or moon and the time; after the Heat or RAD panel when one is up). Night is 20:00 to 05:00, with a warm dusk and dawn either side.
- Outdoors (Scrapton, the Ash Dunes, the Glowwild, the Crater, the Skylift, the Skyport and the Noble Ring) the screen darkens
  at night, and every lamp, fire, glowing object and save point lights its own pool; the hero carries a small light.
  Underground and indoor areas look the same at any hour.
- At night Husks claw out of the ground near you in the wastes: the Ash Dunes, the Glowwild, the Crater (as glass Husks),
  and Rust Flats outside the town once Act 2 has begun. One every 25 s at most, two alive at most, never during a story
  fight or a boss, never near a save point. They crumble at dawn. Husks drop gel, so night is the time to gather it.
- Not built: shops and NPCs keeping hours (every story NPC must stay reachable).

**Radiation** in the Glowwild and the Crater: a meter (RAD on the HUD) fills while you are out there. Full after 100 s
with the caravan filter mask from Act 2, 200 s with the **Rad Filter** mod. At full, health drains 2% of max per second,
down to 1 (radiation never lands the killing blow). Standing at a save point (the filter stations) clears it fast, and it
drains away in any other area. Awakening gives 10 s of immunity. The meter stands still during boss fights, so bosses keep
their measured balance. Measured: walking camp to relay in the Glowwild takes 17 s and the Crater rim to its save point
14 s; with the fights on the way a normal crossing is about 75-80 s and ends near 80% radiation. At first the meter filled
in 75 s, which made everyone sick on the way.

**Playtest pass** (real key presses in a non-saving tab): boards, vents, the shop and every pause tab work from the keys;
saves keep the clock, Heat, standing, jobs, materials and mods; Versus and the rival duel are untouched; night lighting costs
about 2 ms a frame. Fixed: respawning now clears radiation (a fall in the Glowwild at full meter drained you again on waking),
quitting to the title and continuing no longer counts as changing area (it took two Heat stars off), and YOU FELL is written
again over the night darkness.

## Moves update (`js/moves.js`)

- **A new S + I skill for every hero.** One bar of energy, the hardest-hitting move short of the ultimate. A hero knows it as soon
  as they know their I move, so old saves and Versus have it at once.

  | Hero | S + I | What it does |
  |---|---|---|
  | Kael | Rising Storm | Lightning uppercut: four hits that carry enemies into the air with you |
  | Nyra | Stilled Verse | Three waves of frost, each reaching further; the third freezes solid |
  | Fenn | Hound's Leap | Leaps onto the nearest enemy; the landing throws everything nearby into the air |
  | Isolde | Eyrie Spire | A spire of ice bursts up under the nearest enemy |
  | Brakk | Warden's Wall | A slab of bedrock ploughs forward, shoving everything ahead of it |
  | Pyra | Forge Breath | A long gout of fire: seven hits, everything left burning |
  | Gale | Downdraft Kick | Up on the wind, then a dive kick and a gust where he lands |
  | Ashka | Caldera | Lava columns break out on both sides, further off each time |
  | Dyna | Recoil Blast | A shaped charge at arm's length; it throws enemies away and kicks her backwards |
  | Vesper | Pinned Shadow | Nails the nearest enemy's shadow down; a moment later the shadow bites |
  | Orin | Back Door | Opens a door behind the nearest enemy; the lance through it knocks them toward him |
  | Mira | Hall of Mirrors | Four mirrors close round an enemy, fire in turn, then shatter |
  | Noct | Lights Out | The screen goes dark; he reappears above the nearest enemy, blade first |
  | Bando | Reel In | The long arm grabs the first enemy and drags it back for a second hit |
  | Aldric | Vanguard | A shoulder charge that carries enemies along, then one great stroke |
  | Sen | After the Bell | Passes through everything; the cuts land when he sheathes the blade |
  | Vega | Fall Up | Turns gravity over: enemies fall into the sky, hang, and are thrown down |
  | Tessa | Second Hand | A giant clock hand sweeps overhead and down, stopping what it catches |
  | Jax | Lucky Coin | Flips a coin and shoots it: five bullets seek the nearest enemies |
  | Ferra | Scrap Press | Two walls of scrap slam together on the nearest enemy |
  | Kiri | Paper Gale | A ring of paper blades turns round her: five cuts, the last one launches |
  | Tarn | Thousand Miles | Appears on one side of an enemy, then the other: three kicks and a launcher |
  | Maren | Brine Bubble | Seals an enemy in a ball of sea water; when it bursts, it heals her |
  | Yara | Fan of Five | Five arrows off one string, in a fan |
  | Brann | Bear Hug | Grabs the nearest enemy, squeezes three times and throws it |

- **Cooldowns**, so a skill cannot be thrown again straight away. Defaults are in `CD` (frames); `CD_FOR` overrides one ability.
- **Combos.** Chaining a normal that connected into the next normal, or cancelling it into any skill, steps you in after the target
  and holds it long enough for the next hit. `ST.movesAll()` in `tools/story-test.js` fires every move and tries every route on a
  Training dummy. Result for all 25 heroes: the J x4 chain is a 4-hit combo, and J J J links into U (23 heroes), I (23) and S + I (25).
  The moves that do not link are the ones that are not hits (lobs, mines, decoys, counters, Tessa's Rewind, Kael's totem) or that
  hit a second time later (Kiri's paper double, Maren's returning wave).
- **Look.** Skills gather and release, shots leave trails in the hero's colour, heavy hits throw streaks, heroes squash and stretch
  on jumps and landings, and S + I draws speed lines. A skill can show its own pose (`p.pose = [anim, frame]`).
- **Effect art.** Ten nine-frame effects made with Higgsfield (hit, lightning, ice, fire, rock, wind, blast, shadow, rift, light)
  are in `assets/fx`, drawn on heavy hits and where the big skills land. The prompts are in `tools/higgsfield-fx.json`.
  `tools/fit-fx.ps1` cuts each generated 3 x 3 sheet into a strip, turns its nearly-black background to true black (the strips are
  drawn additively, so anything lighter shows as a box) and writes `list.json`, which is what the game reads. To drop an effect,
  delete its strip and run the script again; the game then uses its built-in particles for it.
- The move layout (a third skill on S + I, cooldowns per move) follows the open-source Bleach vs Naruto engine. Only how its
  moves are organised was used; no code, characters, art or sound from it is in this game.

## What is in this build

- **Heroes:** Kael (starts at the bottom, in Deepline; energy = Volt) and Nyra (starts at the top, in Aurelia; energy = Resonance).
  Both start with only basic attacks and get moves back through Memory Shards, on the same schedule.
- **Four unlockable elemental heroes**, each with a signature summon and a full kit (skill, alt skill, special, power mode, awakening, ultimate):
  | Hero | Element | Signature | Unlocked by |
  |---|---|---|---|
  | Fenn | Thunder | Thunder Wolf: a lightning wolf that hunts enemies down | Finishing Act 1 on Kael's story |
  | Isolde | Ice | Ice Bird: seeks out up to four enemies and freezes them | Finishing Act 1 on Nyra's story |
  | Brakk | Earth | Earth Dragon: a stone serpent that ploughs through everything | Winning 3 ranked fights in the Pit Arena |
  | Pyra | Fire | Fireball and Sun Flare: explosions and burning | Landing a 20-hit combo |

  Every bonus hero wakes in their own tutorial zone (see **Story structure**), then joins Kael's or Nyra's road for the rest of Act 1
  with their own abilities standing in for that hero's.
  On the hero select screen, **U** opens "Unlock all heroes", which takes a 4-digit code (ask the author; only its hash is stored, in `js/data2.js`).
- **Four more heroes** (ten in all): **Gale** (wind: Wind Blade, Updraft, Cyclone), **Ashka** (lava: Magma Glob, Lava Geyser, Molten Wave),
  **Dyna** the weapon artist (Grenade, Proximity Mine, Rocket) and **Vesper** the ninja (Star Volley, Smoke Step, Phantom Rush).
  Story unlocks: find 3 hidden shards, reach level 8, buy 5 upgrade levels, win a Versus match against the bot.
- **Ten more heroes: the legends** (twenty in all, `js/heroes4.js`). Each has a full kit, an ultimate, their own sprite, tutorial and Act 2 secret.
  They are **much stronger** than the first ten (+50% damage, +40% health, faster energy) and they are **earned**: each stays locked in the
  story *and* in Versus (PvP and PvB, either side) until its feat below is done, or until the unlock code is entered
  (hero select: U; Versus pick screen: confirm on a locked hero). The code itself is not in the repository, only its hash.
  | Hero | What they are | Special rule | Kit (U / S+U / I) | Unlocked by |
  |---|---|---|---|---|
  | Orin | Rift-walker | **Perfect guard = between worlds**: untouchable for 5 s or until he attacks; that attack is an ambush (+50%) | Rift Bolt (through walls), Fold (drags an enemy to you), Gate Lance | Land 5 perfect guards |
  | Mira | Mirror-walker | Same rift guard (4 s), and she leaves a reflection that shatters | Glass Fan (bounces), Reflection (decoy), Prism (split beam) | Find any Act 2 secret |
  | Noct | Void swordsman | Same rift guard (3 s), but the ambush is double damage | Unseen Cut (lands on the enemy, ignores shields), Afterimage (delayed cut), Null Crescent | Finish Act 2 chapter 1 |
  | Bando | Long-armed brawler | Every punch reaches across the room | Long Jab (half the screen, through bars), Slingshot (yank them or sling yourself), Wind-Up | Beat the Scrap Baron |
  | Aldric | Greatsword knight | Wide perfect guard that counter-cuts automatically | Earthcleave, Oathkeeper (brace: take a quarter, answer with the blade), Iron Tempest | Reach level 12 |
  | Sen | Quick-draw swordsman | Stand without attacking for a moment: the next Draw is a TRUE DRAW (double damage, twice as far) | Draw (dash-cut), Falling Leaf (launcher), Three Breaths | 40-hit combo |
  | Vega | Gravity | Hold jump in the air to fall slowly | Heavy Star (pulls, then bursts), Crush, Singularity | Find 8 hidden shards |
  | Tessa | Time | A perfect guard freezes nearby enemies | Stopwatch (2.5 s freeze), Rewind (back 3 s, with that health), Slow Hour (stops enemy shots) | Finish 3 heroes' tutorials |
  | Jax | Six-shooter | Every sixth Quick Shot is a DEAD-EYE (triple, pierces) | Quick Shot (15 energy), Trick Shot (ricochets), Fan the Hammer | Hold 1500 creds |
  | Ferra | Magnet and scrap | Polarity alternates pull / push | Sawback (out and back), Polarity, Scrap Halo (orbiting blades) | Buy 12 upgrade levels |

  The hero grid switches to two rows of ten once there are more than ten heroes (legends carry a gold mark); a hero with no splash
  art shows its sprite there. **Splash art for these ten** is in `assets/bg` (`hero_<id>.png` 96x128, `ult_<id>.png` 520x260; full-size
  originals in `assets/source`); the game picks the files up by name. The prompts are in `tools/higgsfield-heroes3.json` (ten 3:4
  portraits and ten 2:1 ultimate cut-ins, same style as the first ten). To redo a picture, delete its file in both folders, then with
  the Higgsfield key set (`$env:HF_KEY`) run `tools/higgsfield-generate.ps1 -Manifest tools/higgsfield-heroes3.json` and
  `tools/fit-art.ps1`.
- **Five more heroes** (twenty-five in all, `js/heroes5.js`). Original characters with a full kit, an ultimate, an S + I skill, their
  own sprite, tutorial and Act 2 secret. They are ordinary heroes, not legends: unlocked by a feat in the story, open in Versus
  from the start. The hero grid goes to three rows.

  | Hero | Element | Trait | Skills (U, S + U, I) | Unlock |
  |---|---|---|---|---|
  | Kiri | Paper | A paper double repeats every skill at half strength | Paper Star, Fold Step (blink through enemies), Crane Flock | Win the duel at the Crater |
  | Tarn | Momentum | Each hit in a row adds 4% damage, up to +50% | Step Kick (through a line), Rising Knee (launcher), Hundred Paces (eight kicks) | Finish Act 2 |
  | Maren | Water | Skills heal her for a quarter of their damage | Brine Lash (pulls), Tide Pool (heals her, slows them), Undertow (drags enemies in) | Finish 6 heroes' tutorials |
  | Yara | Longbow | Arrows hit harder the further they fly, up to +80% | Long Arrow, Vault Shot (springs back, pins), Arrow Rain | Reach level 15 |
  | Brann | Fury | Hits harder the less health he has, up to +60%; kills heal him | Maul (two swipes), Roar (stops everything nearby), Landslide (charge and slam) | Find 15 hidden shards |

  Their splash art is in `assets/bg` like everyone else's; the prompts are in `tools/higgsfield-heroes4.json` (same two commands
  as above, with that manifest).
- **Ultimates for everyone:** hold W and press I with a full energy bar (all three segments), or with one segment while awakened.
  Each hero has its own sequence: lightning storm, screen-wide cut, wolf pack, deep freeze and shatter, stone dragons and rock pillars,
  meteor rain, twin giant tornadoes, a floor of lava geysers, a carpet of bombs, a flurry of teleporting cuts.
  In the story, awakening and the ultimate arrive with the Act 1 boss memory.
  When an ultimate starts, the fight freezes for a moment and a band of that hero's splash art crosses the screen
  (`assets/bg/ult_<hero>.png`; prompts for these and the Versus arenas are in `tools/higgsfield-ults.json` and `tools/higgsfield-arenas.json`).
- **Versus mode** (title menu): Player vs Player on one keyboard, or Player vs Bot (Easy / Normal / Hard), best of three, on ten arenas or a random one.
  Three arenas exist only in Versus: Crater Rim, Aurelia Spire and Deep Foundry.
  **Bot vs Bot** is a watch mode: pick both heroes and each bot's level (Easy / Normal / Hard), then watch; Speed
  (menu or Esc) runs the fight at normal, double or four times speed.
  **Format** (Player vs Bot, Player vs Player, Bot vs Bot): 1 vs 1, best of three; or 3 vs 3, a team battle. In 3 vs 3
  each side picks three heroes (Esc takes back the last pick), then the Team Order screen sets who fights first (J on one
  hero, then on another of the same team, swaps them). When a hero falls or loses on time, that side's next hero steps in;
  the hero still standing stays with the health they had left plus 20% (and their energy). The last team standing wins.
  The three squares under each health bar show the team: out, fighting, waiting.
  **Arcade** (one player, 1 vs 1 or 3 vs 3): six stages against bots that get harder (Easy, Easy, Normal, Normal, Hard,
  Hard); each stage is a full match against a random hero or team, and the last is led by a legend at the Aurelia Spire.
  A lost stage can be continued (the stage is fought again; continues are counted). The clock counts fighting time
  only. The best clear for each format (fewest continues, then fastest) is kept in localStorage `shattered-worlds-arcade-v1`.
  The first ten heroes and the newest five are available in Versus whether or not they are unlocked in the story; the ten legends must be earned (see above). Player 2: arrow keys, and 1-6 on the number pad
  (or 7 8 9 0 - = on the top row) for attack, jump, dash, skill, special, awaken.
  Versus has its own energy rules: energy comes mainly from landing hits (and from being hit), and holding attack + jump
  charges it at about half the story's speed. The menu's "Energy gain" row sets Slow / Normal / Fast.
  A perfect block (guard in the last few frames before a hit lands) stuns the attacker: one second for a direct blow,
  half a second for a projectile or summon. A stunned fighter cannot move or escape. Ultimates cannot be interrupted.
  The numbers are at the top of `js/versus.js` (`GAIN`, `PASSIVE`, `CHARGE`, `HIT_*`, `STUN_*`, `BOT_PERFECT`).
  **Training** is the third Versus mode: no timer and no knock-outs, both fighters heal when left alone, the player has
  endless energy, and the hero's moves are listed on screen. The dummy can stand still, guard, attack every two seconds
  (for practising perfect blocks) or fight back like a bot, and a counter shows the hits and damage of the last combo.
  **Esc pauses any Versus fight.** The pause screen has the full move list for both fighters (inputs, energy cost and what
  each move does) and, in Training, the dummy, endless-energy, on-screen-moves and reset options. Quitting a fight is on that screen.
  **Versus balance:** every hit landed in Versus is multiplied by the attacker's entry in `V.tune` (top of `js/versus.js`);
  the story is not affected. The ten legend heroes have no entry on purpose: they are meant to be super strong and win about
  87% of rounds against everyone else. The table evens out the other fifteen against each other. It was derived from a bot
  tournament (`tools/versus-balance.js`: every pair of those fifteen, both sides, bots on Normal). Untuned, their win rates
  ran from 30% to 77%; with the table they run from about 41% to 59%.
  Re-run the tournament after adding or changing heroes: `VB.solve(10)` adjusts the table, `VB.table()` prints it.
  **Rival Duel** (fourth Versus mode, and a hook for the story): one fall, no clock, on the Crater Rim, against the lead hero
  of the other road (Kael's road meets Nyra, Nyra's road meets Kael), with the rival driven by the Versus bot.
  The story starts the same fight with `SW.versus.duel({ rival, diff, title, rivalName, canQuit, onEnd })`: the player fights
  with their real level, upgrades and unlocked moves on a copy of the save, the rival mirrors that progress, the story is
  frozen meanwhile and comes back exactly as it was, and `onEnd` gets `'win'` or `'lose'`. A lost duel can be retried on the
  spot. The full contract is in the comment above `V.duel` in `js/versus.js`.
- **Upgrades:** pause menu > UPGRADES. Spend creds on seven tracks, five levels each: combo damage, skill damage, special damage,
  max HP, energy gain, guarding, awakening length.
- **Status effects:** burn (damage over time) and freeze (held in place; bosses resist most of it).
- **7 of the 12 zones:** Deepline Slums, Neon Market, Pit Arena, Old Metro / The Sump, Med-Lab Sector 7, Skyport, Rust Flats / Scrapton.
  The other five are on the world map as Act 2 / 3.
- **4 bosses** with phases and telegraphs: Tusk, Warden-01, Grist the Rat King, Captain Brandt.
- **11 enemy types** from the GDD table (thug blocks every 3rd hit, drones burst-fire and explode, enforcers must be hit from behind,
  Husks only take energy damage, crawlers are armoured from the front, and so on).
- **Systems:** 10 main missions, dialogue with portraits, major shards with flashback cutscenes, hidden minor shards, levels and stat points,
  assists, shop, Pit Arena waves, save points plus autosave, world map, pause menu (missions / skills / journal / stats / system).
- **Balance** was tuned against two scripted players (T.bench() in 	ools/harness.js): one that only mashes attack and one
  that guards, slipsteps and heals. Regular fights cost the masher far more health, and every boss beats the masher most of the
  time while the careful player wins with roughly 30-45% health lost. Bosses counter-attack after five free hits.
- **The story is complete:** Act 1 (a tutorial per hero), Act 2 (the Surface and the Crater) and Act 3 (six missions and the ending).
- **Cyber mods and crafting** are in (see "Cyber mods" above).
- **Heat and factions** are in (see "Heat and factions" above), and the fourth faction, the black market, too (see "The
  Ember Ledger" above).
- **Side quests:** 4 of the design document's 10 are in (see "Side quests" above).
- **Day/night and radiation** are in (see "Day/night and radiation" above). Every system in the design document is now built,
  apart from shop hours (only the black market keeps them: it trades at night).

## Story structure

**Act 1: every hero has a different first tutorial.** Each of the twenty-five heroes wakes somewhere else, with their own mission, cast,
boss and first memory. The tutorials teach the same basics in a different order, with a skill test built around that hero's first ability.

| Hero | Wakes in | Skill test | Tutorial boss |
|---|---|---|---|
| Kael | Deepline Slums | dart through the bars | Tusk |
| Nyra | Med-Lab Sector 7 | the Husk only she can see | Warden-01 |
| Fenn | The Beast Pens | chain a bolt through the bars | Kennel-Master Holt |
| Brakk | Shaft Nine | smash rubble with a full combo, lob a boulder onto a plate | Foreman Crake |
| Gale | The Vent Stacks | cut a whole line of vent-rats with one Wind Blade | Big Bellows |
| Dyna | The Scrapworks | bounce a grenade through the bars | Gunsmith Korr |
| Isolde | Cryo Vault 9 | aim shards up at drones | Handler Voss |
| Pyra | The Burn Ward | burn down a barricade | Fire Marshal Ilse |
| Ashka | The Core Sump | burn Enforcers out from behind their shields | Chief Stoker Dren |
| Vesper | The Night Ward | get behind shields, stars through the bars | Proctor Hale |
| Orin | Platform Zero | Rift Bolt through the bars | The Conductor |
| Bando | Dockside Nine | punch the lock through the bars | Dockmaster Graft |
| Sen | The Rust Dojo | one Draw through a line of rats | The Whetstone |
| Jax | The Long Bar | shoot drones out of the rafters | Lady Ante |
| Ferra | The Crusher Yard | one Sawback through a line of rats | Yardmaster Slag |
| Mira | The Observation Gallery | Glass Fan through the bars | Chief Observer Lane |
| Noct | The Blank Wing | cut Enforcers down behind their shields | Auditor Crane |
| Aldric | The Proving Hall | smash a barricade, then cleave a line | Drillmaster Hask |
| Vega | Pylon Chamber Six | drag drones together with a Heavy Star | Chief Rigger Tolle |
| Tessa | The Archive | Stopwatch dart through the bars | Archivist Penn |
| Kiri | The Paper Shrine | Paper Star through the bars | Brother Cinder |
| Tarn | Mile Zero | one Step Kick through a line of rats | Ganger Ballast |
| Maren | The Hydro Ward | Brine Lash through the bars | Ward Sister Purl |
| Yara | The Firing Gallery | shoot drones out of the rafters | Rangemaster Keen |
| Brann | The Ice House | Maul a whole line of rats | The Furrier |

After the tutorial a bonus hero walks into the Neon Market (Kael's road) or the Med-Lab admin wing (Nyra's road) and plays the rest of
Act 1 there, with their own lines at the Cartographer, Thessaly and the Act 1 boss, and their own memories at every shard.

**Act 2 onward: one road for everybody.** The missions are the same whoever you play:
*Dust and Debts* (bounty board, Ash Dunes, the Scrap Baron), *What Grows in the Glow* (Glowwild, the Halcyon relay, the Glowmother)
and the finale, *Where the Sky Came Down* (the Crater, east of the Glowwild).
What changes per hero:

- **Conversations.** Marlo, Juniper, the bounty board, every boss and each beat of the Crater get a different line from each hero.
- **Abilities.** Each hero fights with their own kit, and the Act 2 memory unlocks their own traversal ability.
- **One secret each**, which only that hero can wake. Anyone else who pokes at it is told it is not theirs. Esc > Mission shows yours.

  | Hero | Secret | Kind | Where |
  |---|---|---|---|
  | Kael | The Standing Stones Answer | event | Ash Dunes |
  | Fenn | The Pale Alpha | boss | Ash Dunes |
  | Brakk | The Hollow | hidden map | Ash Dunes |
  | Gale | The Wind Remembers | event | Ash Dunes |
  | Dyna | The Last Ashfall Bomb | event | Ash Dunes |
  | Nyra | The Drowned Choir | hidden map | Glowwild |
  | Isolde | The Last Eyrie | event | Glowwild |
  | Pyra | Retrieval Unit 03 | boss | Glowwild |
  | Ashka | The Sleeping Vent | event | Glowwild |
  | Vesper | The Courier's Last Run | event | Glowwild |
  | Orin | The Door You Left | event | Ash Dunes |
  | Bando | The Long Haul | event | Ash Dunes |
  | Sen | The Teacher's Mark | event | Ash Dunes |
  | Jax | Wanted: Six | event | Ash Dunes |
  | Ferra | Old Iron | event | Ash Dunes |
  | Mira | The Girl in the Glass | event | Glowwild |
  | Noct | The Cut Not Yet Made | event | Glowwild |
  | Aldric | The Last Company | event | Glowwild |
  | Vega | Let Them Fall | event | Glowwild |
  | Tessa | One Long Second | event | Glowwild |
  | Kiri | A Thousand and One | event | Ash Dunes |
  | Tarn | The Stone With No Number | event | Ash Dunes |
  | Brann | Her Mark | event | Ash Dunes |
  | Maren | Sweet Water | event | Glowwild |
  | Yara | What the Stone Points At | event | Glowwild |

**The Act 2 finale: the Crater** (`js/story-crater.js`). The road crosses a field of fused glass, a Halcyon field post running
something called the PARALLAX VEIL, and ends on the Crater floor, where someone in Halcyon white is waiting. It is the lead hero of
the other road (Nyra if you are on Kael's road, Kael if you are on Nyra's): the veil shows each of them the other as a Halcyon agent,
so they fight. The fight is the Versus **Rival Duel** (`SW.versus.duel`), with the rival drawn in Halcyon white and named
HALCYON AGENT. The veil does not break here (that is Act 3), but it slips: the white figure flickers to its real face, more
often as it loses health, and the traces it left on the way in are the other hero's element (ice on Kael's road, lightning on Nyra's).

- **Win:** the agent goes down, the hero glimpses the face under the armour, and the duel pays 300 creds and a stat point.
- **Lose** (fall, then give up from the defeat screen; you can also retry on the spot): the agent stands over the hero and does not
  strike. No prize.
- **Either way** the Crater Rift opens, the agent goes up it, and the act ends when the hero steps up to the rift. The save flag
  `crater_duel` holds `'win'` or `'lose'` for Act 3 to read. The duel runs on a copy of the save, so it cannot change it.

**Duel balance.** The rival copies the player's level, upgrades, stats and unlocked moves. On those equal terms the Versus bot
loses to plain button-mashing (9 to 12 wins in 12 for every hero), so the rival gets an edge of its own, set per hero in
`js/story-crater.js` (`FOR`): +18% damage and +50 health per step, 3 to 8 steps for the first ten heroes and 8 to 13 for the legends.
The bot stays on Normal: the Hard bot guards more, attacks less and is easier to mash down. `ST.duelBench()` in `tools/story-test.js`
fights the duel for real with the same two scripted players as the boss bench. Over 24 fights each, at level 10 with four moves:

| | Masher wins | Careful player wins | Careful player's health left |
|---|---|---|---|
| First ten heroes | 2 to 8 of 24 (Nyra 14) | 19 to 23 of 24 | 34 to 60% |
| Legends (favoured on purpose) | 6 to 19 of 24 | 20 to 24 of 24 | 40 to 59% |

A repeat run moves a hero's result by about 4 wins in 24. To retune one hero, change its number of steps in `FOR` and run
`ST.duelBench(['pyra'], 24)`.

The Versus balance table (`V.tune` in `js/versus.js`) does not apply to this duel: for its length both fighters' entries are set
to 1 and put back afterwards, so the duel has one balance table, not two stacked, and a change to the Versus table cannot shift
the duel. `ST.duelBench(heroes, n, { keepTune: true })` measures the duel with the Versus table left on, for comparison.

**Act 3: Convergence, part 1** (`js/story-act3.js`). Follows the Act 3 outline in the design document, with original characters
in every role. Finishing Act 2 now starts it.

- **A3-1 Two Worlds, One Plan.** Back across the Crater, Halcyon is guarding the veil mast at Field Post 3: a fight, then you overload
  it. The veil drops everywhere at once, and the figure on the Crater floor turns out to be the other road's lead hero (Nyra for Kael's
  road, Kael for Nyra's), with a line of their own for each of the 25 heroes. They become your **partner**: press O when the
  awakening bar is not full to call them in (Kael: lightning on up to four enemies; Nyra: a line of frost that freezes). War council
  at Marlo's fire in Scrapton; the Metro Shaft is unbarred for everyone.
- **A3-2 Rally the Deep.** In the Pit Arena, the Bookie calls the Grand Melee: Anvil, the Pit champion, as a boss, then a gauntlet
  of five waves of Deepline's gangs. Win and Deepline follows you; Anvil joins as a second assist (a slam that floors everything
  close; Esc > Assist switches). If you fall in the gauntlet, the Bookie restarts it from the gauntlet, not from Anvil.
- Balance (`ST.act3` plays it through; the numbers below are from scripted fights at level 12 with four moves): against Anvil the
  masher dies nearly every time, the careful player wins losing 29 to 54% (the legends much less); through the gauntlet, starting
  healed, the careful player ends with about 20 to 60% health and the masher sometimes falls.
- **A3-3 Storm the Skylift** (`js/story-skylift.js`, new zone `skylift`, reached by the road door east of Scrapton's town). The army
  gathers at the gate (Marlo, Anvil and your partner talk there); break Halcyon's gate guard, then board the lift. Both ends of the
  platform shut and it climbs while Halcyon drops five boarding parties on you (an altitude bar fills on the right). At the top,
  the engineer's med-kit heals you and **Lord Castellan Vane**, keeper of the Skylift, fights you, with a line for each of the 25
  heroes; beaten, he stands aside. A door at the top leads to the Skyport (where Kael's-road heroes no longer meet the Act 1 boss),
  and consoles ride the lift up and down afterwards.
  Balance (level 13, four moves): on the ride the masher usually falls and the careful player arrives with 15 to 87% health; against
  Vane the masher dies nearly every time and the careful player wins most fights losing 37 to 62%. `ST.skylift(hero)` plays it through.
- **A3-4 The Noble Ring Uprising** (`js/story-noble.js`, new zone `noble`, east of the Skyport). Aurelia's gilded district, where
  every citizen wears a Halcyon control chip (a red light at the temple) and stands where told. Three guarded relay towers run the
  chips: clear each guard, cut the relay, and that block wakes up. With all three down, the Chancery opens and **Prefect Sorrel
  Quist**, keeper of the chips, fights you (a line for each of the 25 heroes). Then **Lord Castellan Vane**, who stood aside at the
  Skylift, turns on Halcyon and joins as a third assist (three gold crescents). Vane takes the design document's defector role.
  Balance (level 14, four moves): the masher usually dies; the careful player wins losing 14 to 70%, about 40% on average.
  `ST.noble(hero)` plays it through.
- **A3-5 The Spire** (`js/story-spire.js`, new zone `spire`, entered through the Chancery door at the east end of the Noble Ring).
  Six floors end to end, each announced as you reach it: the Atrium, the Shard Vault (the harvest ledger shows every stolen memory
  being fed to the core on the Director's authority), Lab 9, **Dr. Ilsa Morrow** (head of Lab 9, mutated by the residue she took;
  the design document's lab chief, as an original character), the Engine Gallery, and the summit, where **Dr. Veyra Kessen**
  fights in the Convergence mech with an escort. Beaten, she hands over the Engine core key and names the Director, who has been
  in the core for a year (a line for each of the 25 heroes when you face her). Balance (level 15, four moves): against Morrow the
  masher dies most fights and the careful player wins losing 40 to 63%. Kessen's mech uses the Act 1 Warden's patterns, which the
  careful test player was written against and dodges almost completely, so how hard she is for a real player is not measured; the
  masher dies about two fights in three. `ST.spire(hero)` plays it through.
- **A3-6 Convergence, and the ending** (`js/story-finale.js`, new zone `enginecore`, down a door at the Spire's summit). The
  Director of Halcyon, **Calder Sayle** (an original character in the design document's villain role), explains the veil: the two
  lead heroes came through the first pulse at its two ends, so together they could reverse it. Three phases back to back: the
  Director; the Director fused with the Engine (a huge beast); and **the Convergence**, his last form. Before phase 3 your partner
  arrives, fights beside you (called in every twelve seconds), brings two healing items, and your ultimate unlocks. Then the
  Engine runs backwards, once: every one of the 25 heroes gets their own homecoming line, the partner says goodbye, and THE END
  card plays. With all 60 minor shards a second card follows, after the credits: a junior researcher restarting a second Engine.
  Balance (level 16, four moves, all three phases, 3 runs each for 6 heroes): the masher dies in phase 1 or 2 nearly every time
  (Nyra's gets through); the careful player wins about 5 runs in 6. `ST.finale(hero, minorShards)` plays it through.
- After the ending, the game stays in free roam; Kessen and Vane wait in the Engine core.

**Adding to it** (all in `js/story.js` and `js/story-world.js`, which extend the game without editing other files):

- A line that differs per hero: `{ s: 'marlo', t: { kael: '...', pyra: '...', K: 'anyone on Kael\'s road', N: 'anyone on Nyra\'s road', _: 'everyone else' } }`.
  A whole conversation for one hero: `D.dialogue['id@fenn'] = [...]`. A line only some heroes get: `h: 'fenn brakk'`.
- A tutorial for a new hero: one entry in `TUT` (zone name, theme, order of beats, enemies, skill test, boss) and one in `TXT` (its words).
- A secret: one entry in `story.secrets`, its dialogue, and a `spot(...)` in the zone. A boss secret adds an arena with `armed`.
- A boss: an entry in `D.enemies` with a `script` of moves (`swings`, `lunge`, `charge`, `slam`, `stomp`, `lob`, `volley`, `summon`).

`tools/story-test.js` is a bot that plays every tutorial and Act 2 as every hero with real inputs, to catch places you could get stuck:
load `tools/harness.js`, then it, and run `ST.all()`. `ST.craterAll()` plays the Crater as every hero, settling the duel as a win
for half of them and a loss for the rest (`ST.crater('pyra', 'lose')` for one).

**Boss balance.** `ST.bench()` in the same file fights every tutorial and Act 2 boss with the two scripted players the original
bosses were tuned against, as the hero and level that actually meets them. Over 8 fights each, after tuning:

| Bosses | Button-masher | Careful player |
|---|---|---|
| Tusk, Warden-01 (the originals, for reference) | dies 3-7 of 8 | never or once; ends 22-50% down |
| The eight first-wave tutorial bosses | dies 2-8 of 8, loses 78-100% of health | dies 0-1 of 8; ends 26-60% down (Holt is easier) |
| The ten legend tutorial bosses (against +50% / +40% heroes) | dies 1-7 of 8, loses 78-100% | never dies; ends 37-56% down (Penn is easier) |
| Scrap Baron, Glowmother, Pale Alpha, Retrieval Unit 03 (first-ten heroes) | dies about half the time | never dies; ends 5-35% down |

A legend walks through the shared Act 2 bosses; that is the point of them. The numbers live in the `tune(...)` tables in
`js/story-world.js` and `js/story-heroes4.js`: `counter` is how hard a boss answers five free hits, the lever that punishes
mashing without hurting a player who guards.

## Cast

The GDD's roles are filled by an **original cast** (Kael, Nyra, Mags, the Cartographer, Tamsin, Wren, Thessaly, Grist, Captain Brandt ...).
No Naruto or Bleach characters, names or sprites are used, and nothing was extracted from the Bleach vs Naruto game files.
The world, story structure, mission layout and systems are the GDD's.

The open-source Bleach vs Naruto engine code was read as a **mechanics reference only** (input scheme, combo-into-skill cancels,
ghost-step escape, air recovery). Those ideas were re-implemented from scratch here; no code or assets were copied.

## Art

- Characters, enemies, tiles, props and effects are generated procedurally at boot (`js/art.js`): a small pixel "rig" bakes every
  animation frame to a sprite sheet. To use hand-made art, replace an entry in `SW.art.sheets` with a sheet that has the same
  frame size and animation names.
- Backdrops, title art and the memory illustrations in `assets/bg/` were generated with Higgsfield (Recraft V4.1).
  Full-size originals are in `assets/source/`, the prompts in `tools/higgsfield-backdrops.json`.
  To make more: set `$env:HF_KEY = "<key id>:<key secret>"` and run `tools/higgsfield-generate.ps1`.
  Drop a PNG named after the zone's backdrop into `assets/bg/` and it is picked up with no code change.
- The four Act 3 maps have their own backdrops: `assets/bg/bg_skylift.png`, `bg_noble.png`, `bg_spire.png`, `bg_core.png`
  (prompts in `tools/higgsfield-act3.json`, originals in `assets/source/`). Recraft gives 16:9; `tools/fit-bg.ps1` crops
  `assets/source/bg_*.png` to 2:1 and saves them at 600x300. Each map's theme and darkening are set at the end of
  `js/story-finale.js`; a missing picture leaves the map with its old look.

## Code map

| File | What it holds |
|---|---|
| `js/data.js` | All content as plain data: heroes, abilities, combat frame data, enemies, dialogue, missions, memories, world map |
| `js/zones.js` | Zone layouts, written with a small builder API (tile coordinates, 30 x 17 tiles per screen) |
| `js/core.js` | Input (keyboard + gamepad), synthesised audio and music, pixel font, save storage |
| `js/art.js` | Procedural sprites, tiles, props, backdrop loading |
| `js/world.js` | Zone runtime: collision, rendering, effects, gates, shards, arenas |
| `js/actors.js` | Physics, hit resolution, the player state machine, projectiles |
| `js/enemies.js` | Enemy AI and the boss move scripts |
| `js/data3.js`, `js/heroes3.js` | Second expansion: wind / lava / bomb / ninja heroes, every hero's ultimate sequence, 10-hero select grid |
| `js/versus.js` | Versus mode: PvP and Player vs Bot, the bot's decision loop, the fight HUD |
| `js/data2.js`, `js/elements.js` | Expansion: elemental heroes, summons, status effects, achievements, upgrade shop, hero select |
| `js/ui.js`, `js/game.js` | HUD, menus, dialogue, missions, travel, save/load, main loop |
| `js/story.js` | Story structure: per-hero dialogue and memories, Act 2 missions and text, secrets, chapter cards |
| `js/story-world.js` | The eight bonus-hero tutorial zones, Ash Dunes, Glowwild, the two secret maps, their cast, props and boss scripts |
| `js/heroes4.js` | Third expansion: ten more heroes, their abilities, ultimates and special rules (rift guard, long arms, true draw ...), sprites, the 20-hero grid |
| `js/story-heroes4.js` | Those ten heroes' tutorials, bosses, memories, Act 2 lines and secrets (data for the builders in the two story files) |
| `js/story-crater.js` | Act 2 finale: the Crater map, mission, the veiled rival and the duel hookup, with lines for all twenty heroes |
| `js/heroes5.js` | Five more heroes (Kiri, Tarn, Maren, Yara, Brann): kits, traits, ultimates, sprites, unlock feats |
| `js/story-heroes5.js` | Those five heroes' tutorials, bosses, memories, lines on the shared road and at the Crater, and secrets |
| `js/story-act3.js` | Act 3 part 1: the veil mast, the partner assist, the war council, the Pit's Grand Melee and Anvil as an assist |
| `js/story-skylift.js` | Act 3, A3-3: the Skylift zone, the gate battle, the ride under attack and Lord Castellan Vane |
| `js/story-noble.js` | Act 3, A3-4: the Noble Ring zone, the control relays, Prefect Quist and Vane joining as an assist |
| `js/story-spire.js` | Act 3, A3-5: the six-floor Spire, Dr. Morrow, Dr. Kessen's mech and the Engine core key |
| `js/story-finale.js` | Act 3, A3-6: the Engine core, the Director's three phases, the ending and the secret ending |
| `js/mods.js` | Cyber mods: material drops, crafting at save points, the Esc > MODS tab and every mod's effect; also the extra pause-tab list (`SW.pauseTabs`) |
| `js/heat.js` | Heat (stars, patrols, the Hunter, vents) and factions (standing, perks, jobs boards, the Esc > FACTIONS tab) |
| `js/daynight.js` | The day/night clock, the night lighting, night Husks, and radiation in the Glowwild and the Crater |
| `js/ledger.js` | The Ember Ledger: the hidden quest, Sable, the test fight, the night market and Ember Heart |
| `js/sidequests.js` | Side quests: Bun Run, Arena Ladder, Dry Wells, Odile's Patients, the Esc > QUESTS tab and the ! / ? markers |
| `js/difficulty.js` | Easy / Medium / Hard / Nightmare, the menus for it, and the easier first bosses |
| `js/moves.js` | Moves update: the S + I skill for every hero, cooldowns, combo linking, the power mode on S + O, and the effects pass |
| `tools/story-test.js` | Play-test bot for the tutorials and Act 2 (`ST.all()`, `ST.craterAll()`) |
| `tools/harness.js` | Frame-by-frame test driver used to play-test both campaigns |

Adding content is mostly data: a new mission is an entry in `D.missions`, a new enemy an entry in `D.enemies`, a new zone a
`build()` function in `js/zones.js` plus a line in `D.world`.
