'use strict';
// Shattered Worlds - The Hollow Crown: the campaign's shared chapters, the same for every hero (the user, 2026-11-20:
// one campaign; "they have to defeat convergence before the space arrive and after that the player can start rescue").
//   engine    chapter 5, The Engine Core: Halcyon's last guard, the Director's end, the Convergence; his last act
//             opens the Beyond.
//   arrival   the card between chapters 5 and 6: Sovereign Vael arrives, the Call, the three layers pinned down.
//   rescue    chapter 6, The Rescue: its card and the words before the map opens (the scenes: rescue-*.js).
//   finale    chapter 7, The Hollow Crown: the Crater, Itsuki, Vael, and the muster's last blow.
//   end       the ending card (the true ending: all 47 brought home).
// In any line: {hero} the hero being played, {bond} their chapter 2 bond, {rival} their chapter 3 rival, {home} their
// chapter 1 place, {layer} their layer. A line may be { sky, land, deep }: what a hero of that layer says.
// Data only; js/saga/saga-core.js plays it.
(function () {
  const SG = window.SW && window.SW.saga; if (!SG) return;
  SG.campaign = {
    engine: {
      place: 'The Engine Core',
      goal: 'Break the Convergence',
      card: 'At the root of the Halcyon Spire the Engine turns like a heart nobody ever asked, and the man who built his world on it is waiting to see who climbs that far.',
      intro: [
        ['sys', "The Engine Core, at the root of the Halcyon Spire. The machine that tore the sky turns slowly here, lit from inside like a lung."],
        ['hero', { sky: "I grew up under this hum. I never knew it had a centre.", land: "So this is what has been eating our sky. It looks smaller than the hole it made.", deep: "Every lamp in Deepline flickers when this thing breathes. Time it held its breath." }],
        ['director', "You climbed the whole Spire. Good. I wanted a witness who could understand what they were seeing."],
        ['director', "Three layers at each other's throats, and still you came up together. My models said that was impossible."],
        ['hero', "Your models had our faces. They never had us."],
        ['sys', "Halcyon's last guard comes down the gantries in white armour and black visors, in perfect step, as if the war never touched them."]
      ],
      meet: [
        ['director', "Do you know what the Engine is for? Not power. Power was the story I sold. It is a door."],
        ['director', "And every door, sooner or later, wants someone to walk through it."],
        ['sys', "Director Sayle steps backward into the light at the Engine's heart, the way a man steps into the sea."],
        ['sys', "The light takes him to the bone, and then past the bone. What walks back out has his voice and nothing else of his."],
        ['convergence', "I was a man who kept accounts. Now I am the sum."],
        ['hero', "Then you have one entry left to make."]
      ],
      win: [
        ['convergence', "You think you have won. You have only finished the arithmetic."],
        ['convergence', "Every door I ever opened, I open now. All at once. Listen. Something out there has been listening to us for years."],
        ['sys', "With the last of himself the Convergence tears the Beyond open as wide as the sky, and calls into the dark: come and take them."],
        ['sys', "The Engine goes still. For one heartbeat the whole Spire is silent. Then, from over the Crater, a sound like a bell rung under water."],
        ['vael', "I hear you, little engine. I have come a very long way to hear you."],
        ['hero', { sky: "That was not thunder. Get everyone off the Spire.", land: "That was not thunder. Thunder has the decency to leave.", deep: "That was not thunder. Down below, they'll be feeling it in their teeth." }]
      ]
    },

    arrival: {
      over: 'THE CONVERGENCE HAS FALLEN',
      title: 'VAEL ARRIVES',
      under: 'THE RESCUE BEGINS',
      paras: [
        'Over the Crater the sky splits along a seam, and a crown the size of a city lowers itself through the wound. There is nothing inside it.',
        'Sovereign Vael has unmade nine worlds. Behind him pours the Hollow Legion, soldiers emptied out of every world he has eaten, grey as ash and silent as snow, and Siege Walkers on legs like towers.',
        'Then comes the Call: a sound under hearing that finds the hollow place in a person and speaks into it in the voice they most want to hear. All across the three layers, heroes stand up with an empty crown of violet light over their heads, and march for Vael.',
        'Everyone the Call could not take is pinned down, holding their own doors against the Legion and fourteen champions born beyond the dark. {bond} is out there somewhere. So is {rival}.',
        'The Crown cannot be broken by one hero. It will take a muster.'
      ]
    },

    rescue: {
      goal: 'Rescue the heroes',
      card: 'The Call has taken some of them and the Legion has pinned down the rest, and between the three layers there is only one road left: the one you walk, door to door, bringing them home.',
      intro: [
        ['sys', "All three layers are burning at once: gold towers going dark, the Surface lit in long lines of fire, Deepline's vents breathing violet."],
        ['hero', { sky: "One door at a time, then. Aurelia first, or last; it doesn't matter, as long as it's all of them.", land: "One at a time, then. The road is long. It always was.", deep: "One at a time, then. Deepline taught me that much: nobody gets left in the dark." }],
        ['sys', "The Called must be beaten to be freed. The rest need someone at their side. Every hero brought home joins the muster, and the muster will storm the Crown."]
      ]
    },

    finale: {
      goal: 'Break the Hollow Crown',
      card: 'The muster gathers on the rim of the Crater under a crown the size of a city, and for the first time since the Ashfall War the Sky, the Surface and Deepline stand in one place on purpose.',
      intro: [
        ['sys', "The Crater. The crown-ship hangs so low that its shadow has weather in it. Beneath it the Hollow Legion stands in ranks to the horizon."],
        ['sys', "Over the rim behind {hero} comes the muster: every hero brought home, from all three layers, and none of them looking back."],
        ['hero', { sky: "Aurelia came down for this. Let it be worth the fall.", land: "The ground under us is ours. Every inch the Legion is standing on.", deep: "Deepline came up into the light for this. Let's not waste the climb." }],
        ['vael', "So the candle gathers its moths. Come, then. Burn together."]
      ],
      meet: [
        ['sys', "Out of the Legion's ranks walks a single figure, and the ranks part for him without being told."],
        ['itsuki', "I'm the last thing between you and him. You know why? Because I'm the strongest thing in any world. This one included."],
        ['itsuki', "Bring the whole muster if you like. I'll count them as they land."],
        ['hero', "Count slowly. There are more of us than you think."]
      ],
      lose: [
        ['itsuki', "Get up. That wasn't a win. I don't take wins I didn't earn."],
        ['hero', "Again."]
      ],
      pre: [
        ['itsuki', "...Huh. That one counted. Fine. He's yours. I'm not staying to watch."],
        ['sys', "Itsuki rises into the crown-ship's shadow and is gone. Above the Crater, the wound in the sky opens like an eye."]
      ],
      vael: [
        ['sys', "Sovereign Vael comes down. He does not fall; he descends, the way night does, everywhere at once."],
        ['vael', "I have unmade nine worlds. Each one believed it was the exception. Yours sings the same song, only louder."],
        ['vael', "Kneel, and the candle goes out gently. Stand, and I will put it out one finger at a time."],
        ['hero', "We've knelt for a hundred years. We're finished kneeling."]
      ],
      win: [
        ['sys', "The muster's last blow lands as one, and the Hollow Crown cracks from rim to rim like river ice in spring."],
        ['vael', "Nine worlds... and the tenth... had too many hands."],
        ['sys', "The crown-ship falls into the Crater without a sound. Across three layers the Legion lowers its weapons and goes still, an army at last allowed to rest."],
        ['hero', { sky: "Look up. That's the sky. Only the sky.", land: "Listen. That's wind. Only wind.", deep: "The vents are breathing clean. Somebody tell the dark it can go home." }]
      ]
    },

    end: {
      text: "The Hollow Crown fell into the Crater, and three layers that had spent a hundred years at each other's throats stood on its rim together. {hero} brought the muster home.",
      trueText: "Every one of them came home. Forty-eight heroes stood on the rim of the Crater, the Sky, the Surface and Deepline in one place on purpose, and the Pact of Three Layers held. The sky is quiet now."
    }
  };
})();
