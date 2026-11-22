'use strict';
// Shattered Worlds — hero dress (2026-11-21, the user: "rebuild all appearance looks", after the sprite study in
// game2 world/bvn-sprite-notes.md). Every hero's sprite is baked from one rig (js/art.js): a head picture (11 x 10), a
// palette and a few sizes. This file gives each hero a look of their own, drawn after their character art
// (assets/source/hero_<id>.png), the way js/sen-sakura.js did for Sen:
//   head     a readable head and hair silhouette, a face with a brow (art.HEADS 'dress_<id>')
//   c / aw   the palette (aw: the awakened sheet's), with contrast between head, body and legs
//   rig      sc / bulk / limb, and the trail (a scarf, sash, coat tail or long hair streaming behind)
//   cloth    painted onto each baked frame after the bake, found by colour: a sash across the chest, a collar, a
//            centre seam (an open coat or a gi), a hem shade above the belt, cuffs, a chest emblem
// Every bake of a dressed hero's sheets goes through here, whoever asks for it (js/clan-poses.js restyles,
// js/anim2.js's in-between "+" sheets, js/apex/apex-core.js's weapons), so the look survives them. Draw-only.
// SW.heroDress.on = false before art.init keeps the old looks.
(function () {
  const SW = window.SW, art = SW.art, D = SW.data;
  if (!art || !art.bake || !art.HEADS || !D) return;
  const HD = SW.heroDress = { on: true, looks: {} };
  const L = HD.looks;

  // ---------- the looks (one per hero; Sen is js/sen-sakura.js) ----------
  // head codes: h hair, H hair shade, s skin, S skin shade, e brow/eye, w white, W grey, m accessory, M its shade, g glow

  // Kael: white hair in spikes, the cyan headband, a narrow eye; a long red scarf streaming from his neck; the vest darker
  L.kael = {
    head: ['.h..h.h....', 'hhhhhhhh...', '.hhhhhhhhh.', 'hhhhhhhhhhh', 'Hmmmmmmmmm.', 'HHhSsssees.', '.HhSssssSss', '..HSssssSs.', '...SSsssS..', '.....SSS...'],
    rig: { trailLen: 6, trailW: 3 }, c: { top: '#2a3550', trail: '#e03a3a' },
    cloth: { collar: '#e03a3a', seam: '#1a2238', hem: '#232d45' }
  };
  // Nyra: dark-blue hair with a fringe swept forward and a long braid behind; gold trim down her pale bodysuit
  L.nyra = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhhh', 'HhhhSsshhh.', 'HhhSssseeh.', 'HhhSssssSss', 'HHhSsssss..', '.HHSSssS...', '..H..SS....'],
    rig: { trailHead: 1, trailLen: 7, trailW: 2 },
    cloth: { seam: '#d9b45a', hem: '#c4c9d4' }
  };
  // Fenn: a wolf-skull hood (ears up, the snout over his brow) with one violet eye glowing in its shadow; armour plates
  L.fenn = {
    head: ['.h...h.....', '.hh.hh.....', '.hhhhhhh...', '.hhhhhhhhh.', 'HhhhhhhhhhW', 'HhhHSSgSSWW', 'HhhHSSSSSW.', '.HhhSSSSS..', '.HHhhSwSw..', '..HHhhhh...'],
    c: { hair: '#dfe3ec', trail: '#b8bcc8' }, rig: { trailLen: 5, trailW: 3 },
    cloth: { seam: '#3d4aa8', emblem: ['#a78bfa', '#6d5ad0'], hem: '#18205a' }
  };
  // Isolde: long pale hair falling down her back and streaming behind; a dark coat with an ice-blue high collar and trim
  L.isolde = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhSsssss.', 'hhhSsssees.', 'hhhSssssSss', 'hhHSsssss..', 'hhH.SSssS..', 'hH...SSS...'],
    rig: { trailHead: 1, trailLen: 6 }, c: { top: '#1e3a6e', pants: '#182c50' },
    cloth: { collar: '#7fd8ff', seam: '#7fd8ff', hem: '#173058' }
  };

  // Brakk: a bald stone giant with a heavy brow over one amber eye; stone armour with darker plate seams and an amber rune
  L.brakk = {
    head: ['...........', '...sssss...', '..sssssss..', '.Sssssssss.', '.SsssssSeee', '.SSsssssgS.', '.Sssssssss.', '..SssssssSs', '..SSssssS..', '...SSSSS...'],
    c: { glow: '#ffb02e', top: '#8a857a', pants: '#3a3530' },
    cloth: { seam: '#3a3732', emblem: ['#ffb02e', '#c87a1a'], hem: '#5e5a54', cuff: '#3a3732', sash: ['#5e5a54', '#46423c'], sashDir: -1 }
  };
  // Pyra: hair that is flame (yellow tips flickering up out of the orange) streaming behind; a crimson jacket, gold collar
  L.pyra = {
    head: ['..m.h.m....', '.hhmhhhm...', '.hhhhhhhh..', 'hhhhhhhhhh.', 'hhhhSsshhh.', 'HhhSsssee..', 'HhhSssssSss', 'HHhSsssss..', '.HHSSssS...', '..H..SS....'],
    c: { acc: '#ffd24a', top: '#5a1a2a' }, rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#ffd24a', seam: '#ff7043', hem: '#3e1220' }
  };
  // Gale: teal hair swept back by the wind under a white band; a white robe with a green sash and a long green tail
  L.gale = {
    head: ['....hhh....', '.hhhhhhhh..', 'hhhhhhhhhh.', 'hhhhhhhhhhh', 'Hhmmmmmmmm.', 'HHhSsssee..', 'HhhSssssSss', '.HhSsssss..', '..HSSssS...', '....SSS....'],
    rig: { trailLen: 7, trailW: 3 },
    cloth: { sash: ['#3fd6a8', '#2a9a78'], hem: '#c8dccc' }
  };
  // Ashka: dark skin, a short black cut; black obsidian armour split by glowing magma seams
  L.ashka = {
    head: ['...........', '...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.HhhSssshh.', '.HhSsssees.', '.HSsssssSss', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    c: { top: '#1e181c' },
    cloth: { seam: '#ff5a1f', emblem: ['#ffb02e', '#ff5a1f'], hem: '#ff5a1f', cuff: '#ff7a2a' }
  };

  // Dyna: messy blond hair, goggles pushed up on the brow, a grin; a khaki jacket with a red bomb bandolier across it
  L.dyna = {
    head: ['..h.hh.h...', '.hhhhhhhh..', 'hhhhhhhhhh.', 'Hmmwmmwmm..', 'HhhhSsshh..', 'HhSssseeS..', '.HSssssSss.', '..SsssssS..', '...SSwwS...', '....SSS....'],
    c: { acc: '#6a4a2a', white: '#bfe8ff' },
    cloth: { sash: ['#c8402a', '#7a2a20'], seam: '#8a7650', hem: '#9a8458' }
  };
  // Vesper: a black hood with the face lost in shadow, two red eyes; a long red scarf wrapped at the throat and streaming
  L.vesper = {
    head: ['...mmmm....', '..mmmmmmm..', '.mmmmmmmmm.', 'mmmmmmmmmmm', 'MmmmMMMMMm.', 'MmmMMMggMM.', 'MmmMMMMMMM.', '.MmmmmmmmMm', '..Mmmmmmm..', '...MMmmm...'],
    c: { glow: '#ff3a4a', acc: '#263052' }, rig: { trailLen: 7, trailW: 3 },   // (the hood its own shade: the cloth pass finds the body by its colour)
    cloth: { collar: '#e0283c', seam: '#2a3458', hem: '#141a30' }, awCloth: {}   // (awakened his top turns red like the scarf: no paint there)
  };
  // Orin: spiky dark hair with a magenta streak; bare arms (sleeveless dark top with a magenta seam), magenta wraps
  L.orin = {
    head: ['..h.hmh....', '.hhhhmhhh..', 'hhhhhmhhhhh', '.hhhhhhhhhh', '.HhhSsshh..', '.HhSssseeS.', '.HSssssSss.', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    c: { acc: '#e04dff', top: '#2a2040', arm: '#c8a080' },
    cloth: { seam: '#5a2a7a', hem: '#1c1830', collar: '#e04dff' }
  };
  // Mira: long grey hair down her back and streaming; a black mirror visor with one cyan glint; a dark grey hooded cloak
  L.mira = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhmmmmmmm.', 'hhhmmmgmmm.', 'hhhSsssSss.', 'hhHSsssss..', 'hhH.SSssS..', 'hH...SSS...'],
    c: { acc: '#1a1c28', top: '#3a3e52', pants: '#2a2e40' }, rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#8a92b8', seam: '#8a92b8', hem: '#2e3244' }
  };

  // Noct: a pointed hood with a teal rim at its edge, the face in shadow and one teal eye; a dark cloak tail; teal trim
  L.noct = {
    head: ['....h......', '...hhhh....', '..hhhhhhh..', '.hhhhhhhhm.', '.hhhhSSSSm.', '.hhhSSSgSm.', '.hhhSSSSSS.', '.hhhhSSSS..', '..hhhhhhh..', '...hhhhh...'],
    c: { acc: '#5ad6c8', trail: '#1e2c30' }, rig: { trailLen: 6, trailW: 3 },
    cloth: { seam: '#5ad6c8', hem: '#2a4a4c' }, awCloth: {}
  };
  // Bando: a green bandana whose knot tails fly behind him, hair tufts under it, a narrow eye and a grin; a dark-seamed vest
  L.bando = {
    head: ['...........', '...mmmmm...', '..mmmmmmm..', 'Mmmmmmmmmm.', 'MMhhSsshh..', '..hSssseeS.', '.HhSssssSss', '..SssssssS.', '...SwwwsS..', '....SSS....'],
    c: { trail: '#b6e84a' }, rig: { trailHead: 1, trailLen: 3 },
    cloth: { seam: '#1c4a40', hem: '#22584a' }
  };
  // Aldric: a closed great helm with a dark T-shaped visor slit; steel plate with darker seams, a gold boss; a long red cape
  L.aldric = {
    head: ['....hh.....', '...hhhhh...', '..hhhhhhh..', '.hhhhhhhhh.', '.Hhhheeeee.', '.Hhhhhhehh.', '.HhhhhhehhW', '.HHhhhhhhh.', '..HHhhhhH..', '...HHHHH...'],
    rig: { trailLen: 6, trailW: 3 },
    cloth: { seam: '#5a6078', emblem: ['#f0e0a0', '#c8a050'], hem: '#6a7288', cuff: '#5a6078' }
  };
  // Vega: long dark-blue hair under a gold circlet set with a star; purple robes with a gold collar and violet seam
  L.vega = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhmmmgmmm..', 'hhhhSsshh..', 'hhhSssseeS.', 'hhhSssssSss', 'hhHSsssss..', 'hhH.SSssS..', 'hH...SSS...'],
    rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#f5c542', seam: '#9d6cff', hem: '#1e1648' }
  };

  // Tessa: full wavy copper hair with brass goggles over it; a brown vest open on a white shirt, a gold watch chain
  L.tessa = {
    head: ['..hhhhh....', '.hhhhhhhh..', 'hhhhhhhhhh.', 'hmmwmmwmh..', 'hhhhSsshh..', 'HhhSssseeS.', 'HhhSssssSss', 'HHhSsssss..', '.hHSSssS...', '..h..SS....'],
    c: { acc: '#b08a3a', white: '#bfe8ff' },
    cloth: { collar: '#f4f1ea', seam: '#f4f1ea', emblem: ['#ffd24a', '#b08a3a'], hem: '#5e4436' }
  };
  // Jax: a wide-brimmed hat throwing his eyes into shadow, stubble; a red poncho with a tail, dark trim
  L.jax = {
    head: ['...mmmm....', '..mmmmmm...', '..MMMMMM...', 'mmmmmmmmmmm', '.MMSSSSSM..', '..hSssee...', '..SsssssSs.', '..SwwwwSS..', '...Swwws...', '....SSS....'],
    c: { white: '#6a5444', top: '#a8302a', trail: '#a8302a' }, rig: { trailLen: 4, trailW: 3 },
    cloth: { collar: '#4a1a14', hem: '#6a1e18', seam: '#c86a3a' }
  };
  // Ferra: a tall red mohawk in spikes over a shaved head, a hard brow; blue plate armour with dark seams
  L.ferra = {
    head: ['....h.h.h..', '...hhhhhh..', '....hhhhh..', '...sHHHss..', '..SssssSee.', '.SsssssseS.', '.SssssssSss', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    c: { top: '#3a5a8a' },
    cloth: { seam: '#1c2840', emblem: ['#d83a3a', '#8a1e1e'], hem: '#2a4468' }
  };
  // Kiri: black hair in a bun with a white pin, side locks; a white kimono with a red collar; a white ribbon streaming
  L.kiri = {
    head: ['...hhh.w...', '...hhhhw...', '..hhhhhhh..', '.hhhhhhhhh.', 'HhhhSsshhh.', 'HhhSssseeS.', 'HhhSssssSss', '.HhSsssss..', '..HSSssS...', '....SSS....'],
    rig: { trailLen: 5 },
    cloth: { collar: '#ff4d6d', hem: '#e2ddd4' }
  };

  // Tarn: short black spikes under a blue headband whose tails fly; a navy tank top on bare arms, white shin wraps
  L.tarn = {
    head: ['...h.h.....', '..hhhhhh...', '.hhhhhhhh..', 'hmmmmmmmmm.', 'HHhhSsshh..', '.HhSssseeS.', '.HSssssSss.', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    c: { top: '#1e2a50', boots: '#e8ecf4', trail: '#3a86ff' }, rig: { trailHead: 1, trailLen: 2 },
    cloth: { hem: '#16203e', collar: '#3a86ff' }
  };
  // Maren: long dark-teal hair flowing back; a white coat with a teal high collar and trim
  L.maren = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhSsshh..', 'hhhSssseeS.', 'hhhSssssSss', 'hhHSsssss..', 'hhH.SSssS..', 'hH...SSS...'],
    rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#2a9d8f', seam: '#2a9d8f', hem: '#cfe2dc' }
  };
  // Yara: a high brown ponytail swinging behind, a fierce eye; dark archer's clothes with a gold sash
  L.yara = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'HhhhSsshh..', 'HhhSssseeS.', '.HhSssssSss', '..HSsssss..', '...SSssS...', '....SSS....'],
    c: { top: '#2a2a22', arm: '#33332a', pants: '#22221c' }, rig: { trailHead: 1, trailLen: 6 },
    cloth: { sash: ['#ffd60a', '#a88a08'], hem: '#1c1c16' }
  };
  // Brann: long dark hair, a heavy brow, a full beard; a dark coat with a pale fur collar and a red sash
  L.brann = {
    head: ['...........', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hHhhSsshee.', 'hHhSsssesS.', 'hHhhhSssSss', 'hH.hhhhhhh.', 'h..Hhhhhh..', '....Hhhh...'],
    c: { top: '#3a2418' },
    cloth: { collar: '#d8c8b0', sash: ['#c1121f', '#7a0a12'], hem: '#2a1a10' }
  };

  // Rook: spiky teal hair over a metal brow plate, a cocky grin; a teal jacket with a raised dark collar
  L.rook = {
    head: ['.h.h.h.h...', '.hhhhhhhh..', 'hhhhhhhhhh.', '.mmmmmwWm..', '.HhhSsshh..', '.HhSssseeS.', '.HSssssSss.', '..SsseeeS..', '...SSsssS..', '.....SSS...'],   // (the smirk a dark line: in the plate's grey it read as a beard)
    c: { white: '#c8ccd8', boots: '#1e3a40' },
    cloth: { collar: '#0e3434', seam: '#0e3434', hem: '#164846' }
  };
  // Sable: long black hair streaming, a sharp eye over a purple mask; a dark purple suit with lighter seams
  L.sable = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhSsshh..', 'hhhSssseeS.', 'hhhmmmmmmm.', 'hhHmmmmmmmm', 'hhH.Mmmmmm.', 'hH...MMmm..'],
    c: { top: '#3e2072' }, rig: { trailLen: 6 },
    cloth: { seam: '#8f7bff', hem: '#2e1658', collar: '#7a3ac8' }
  };
  // Dune: a sand cloak's hood with the face lost in its shadow and one pale eye; a scarf over the mouth; a cloak tail
  L.dune = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhhh', 'HhhhSSSSSh.', 'HhhSSSgSSS.', 'HhhmmmmmmmM', '.HmmmmmmmM.', '..MmmmmmM..', '...MMMMM...'],
    c: { skin: '#4a3424', hair: '#a8824a', acc: '#7a5a30', top: '#9a7a48', arm: '#8a6c3e', trail: '#9a7a48' }, rig: { trailLen: 5, trailW: 3 },
    cloth: { seam: '#6a5230', hem: '#7a6038', collar: '#7a5a30' }
  };
  // Moro: black hair tied in a knot at the back, long bangs framing his face; a dark robe with a pale collar
  L.moro = {
    head: ['.hh........', 'hhhhhhh....', '.hhhhhhhh..', 'hhhhhhhhhh.', 'HhhhhSshhh.', 'HhhSssseeh.', '.HhSssssSss', '.HhSsssss..', '..hSSssS...', '....SSS....'],
    c: { top: '#2e3250' },
    cloth: { collar: '#9a9ed0', seam: '#5b5f97', hem: '#22253e' }
  };

  // Pell: an angular porcelain mask with one slanted slit eye glowing magenta and a thin painted smile, dark hair behind;
  // a magenta coat with a black collar and a coat tail
  L.pell = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhh..', 'hhhwwwwwww.', 'hhwwwwwwww.', 'hhwwweegww.', 'hhwwwwwwWw.', '.hwwwwwwww.', '.hhwwWWWw..', '..hh.www...'],
    c: { top: '#7a1660', trail: '#7a1660' }, rig: { trailLen: 5, trailW: 3 },
    cloth: { collar: '#1a0c18', seam: '#b5179e', hem: '#5a1048' }
  };
  // Hollis: an old sage under a green band, bushy white brows, a long white beard; a pale rope sash across his green robe
  L.hollis = {
    head: ['...........', '...hhhhh...', '..hhhhhhhh.', '.hhhmmmmmm.', 'hhhhSsswww.', 'hhhSssseeS.', 'hhHSsssSsss', 'hhHwwwwwwww', 'hH.wwwwwww.', 'h...wwwww..'],
    cloth: { sash: ['#d8c89a', '#8a7a58'], hem: '#3a5a2e' }
  };
  // Kestra: a high red ponytail swinging behind, a fierce eye; a dark red jacket with a gold collar and orange trim
  L.kestra = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'HhhhSsshh..', 'HhhSssseeS.', '.HhSssssSss', '..HSsssss..', '...SSssS...', '....SSS....'],
    c: { top: '#4a1418' }, rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#ffd24a', seam: '#ff6b35', hem: '#3a1012' }
  };
  // Ivo: wild black hair in big spikes, a hard brow; a black sleeveless top with a gold collar, gold wraps
  L.ivo = {
    head: ['h.h.h.h....', '.hhhhhhh...', 'hhhhhhhhh..', '.hhhhhhhhh.', '.HhhSssseee', '.HhSssssesS', '.HSssssSss.', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    cloth: { collar: '#ffb703', hem: '#2a2a2a' }
  };

  // Nami: short ragged dark-blue hair, a sharp eye and a shark's grin of white teeth; a blue coat with a raised collar
  L.nami = {
    head: ['...hh.h....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'HhhhSsshhh.', 'HhhSssseeS.', '.HhSssssSss', '..SswwwwS..', '...SSsssS..', '.....SSS...'],
    c: { white: '#f4fbff', top: '#1a3a7a' },
    cloth: { collar: '#0a1e48', seam: '#48cae4', hem: '#12306a' }
  };
  // Lin: long black hair falling and streaming behind; a white blouse with a cyan collar
  L.lin = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhhSsshh..', 'hhhSssseeS.', 'hhhSssssSss', 'hhHSsssss..', 'hhH.SSssS..', 'hH...SSS...'],
    cloth: { collar: '#5ec8d8', hem: '#d4eaec' }
  };
  // Corvin: a crow's hood with a gold beak jutting over the shadowed face and one pale eye; purple feather trim
  L.corvin = {
    head: ['...hhhhh...', '..hhhhhhhh.', '.hhhhhhhhhh', '.hhhHHHHhh.', '.hhhHSSSSm.', '.hhHSSSgSmm', '.hhHSSSSSmm', '.hhhSSSSSm.', '.hhhhSSSS..', '..hhhhh....'],
    c: { trail: '#2a1a3a' },
    cloth: { collar: '#7209b7', hem: '#3a1a5a', seam: '#2a1a3a' }
  };
  // Thorne: long white hair with a braid streaming behind, a dark brow and eye on a pale face; a crimson coat
  L.thorne = {
    head: ['...hhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'hhhhhhhhhh.', 'hhhHSsseee.', 'hhhSsssseS.', 'hhhSssssSss', 'hhHSsssss..', 'hHh.SSssS..', 'hH...SSS...'],
    c: { skin: '#d8ccc0', top: '#5a1a24', trail: '#e8e2d0' }, rig: { trailHead: 1, trailLen: 6 },
    cloth: { collar: '#2a0c12', seam: '#8a1c2a', hem: '#44121a' }
  };

  // Ume: pale-green hair in a messy high bun with locks falling by her face; a green coat crossed by a bag strap
  L.ume = {
    head: ['...hhh.....', '..hhhhh....', '..hhhhhhh..', '.hhhhhhhhh.', 'HhhhSsshhh.', 'HhhSssseeS.', 'hHhSssssSss', 'h.HSsssss..', 'h..SSssS...', '....SSS....'],
    c: { boots: '#1b2a22' },
    cloth: { sash: ['#1b4332', '#12301f'], collar: '#9ef01a', hem: '#245a42' }
  };
  // Tarek: a grey head-wrap whose tails fly behind, dark hair under it; a studded leather vest (gold studs, a seam)
  L.tarek = {
    head: ['...........', '...mmmmm...', '..mmmmmmm..', 'Mmmmmmmmmm.', 'MMhhSsshh..', '.hhSssseeS.', '.HhSssssSss', '..SssssssS.', '...SSsssS..', '.....SSS...'],
    c: { trail: '#6c757d' }, rig: { trailHead: 1, trailLen: 3 },
    cloth: { seam: '#c9a227', emblem: ['#c9a227', '#7a6018'], hem: '#2a2214' }
  };
  // Isa: black hair in a bun pinned with red sticks; a white robe crossed by a red sash, a black collar
  L.isa = {
    head: ['....hh.m...', '...hhhhm...', '..hhhhhhh..', '.hhhhhhhhh.', 'HhhhSsshhh.', 'HhhSssseeS.', '.HhSssssSss', '..HSsssss..', '...SSssS...', '....SSS....'],
    c: { acc: '#ef476f' },
    cloth: { sash: ['#ef476f', '#a8304a'], collar: '#14141e', hem: '#e0dccf' }
  };
  // Garo: a rounded great helm with a dark visor slit and breathing holes; plate armour with darker seams
  L.garo = {
    head: ['...........', '...hhhhh...', '..hhhhhhhh.', '.hhhhhhhhh.', '.Hhhheeeee.', '.Hhhhhhhhh.', '.HhhhhheehW', '.HHhhhhhhh.', '..HHhhhhH..', '...HHHHH...'],
    cloth: { seam: '#6a7280', hem: '#7a8494', cuff: '#6a7280' }
  };

  // ---------- the engine ----------
  const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const owner = {};   // sheet id -> [hero, 'base' | 'aw']
  function mapSheets() {
    Object.keys(L).forEach(id => {
      const h = D.heroes[id]; if (!h) return;
      [[h.sheet, 'base'], [h.sheetArmed, 'base'], [h.sheetAw, 'aw']].forEach(([sid, k]) => { if (sid) { owner[sid] = [id, k]; owner[sid + '+'] = [id, k]; } });
    });
  }
  function dressCfg(id, kind, cfg) {
    const d = L[id], c2 = Object.assign({}, cfg);
    if (d.head) { art.HEADS['dress_' + id] = d.head; c2.head = 'dress_' + id; }
    if (d.rig) Object.assign(c2, d.rig);
    const over = kind === 'aw' ? d.aw : d.c;
    const cc = Object.assign({}, cfg.c || {});
    if (over) Object.keys(over).forEach(k => { cc[k] = over[k]; delete cc[k + 'D']; });   // (bake makes the shades afresh)
    if (d.cloth && cc.arm && cc.top && cc.arm.toLowerCase() === cc.top.toLowerCase()) { cc.arm = art.shade(cc.top, 0.93); delete cc.armD; }   // sleeves told apart from the body
    if (kind === 'aw' && d.awOutline) c2.outline = d.awOutline;
    c2.c = cc;
    return c2;
  }
  // the cloth pass: K = { sash: [col, shadow] | null, sashDir: 1 (back shoulder to front hip) | -1, collar, seam, hem,
  // cuff, emblem: [col, col2] }
  function cloth(sid, cfg, K) {
    const s = art.sheets[sid]; if (!s || !K || !cfg || !cfg.c) return;
    const c = s.img, x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), d = im.data, W2 = c.width;
    const C = cfg.c, top = hexRgb(C.top), topD = hexRgb(C.topD || art.shade(C.top, 0.7)), arm = C.arm ? hexRgb(C.arm) : null, edge = hexRgb(C.fore || C.hand || C.skin);
    const is = (i, q) => q && d[i] === q[0] && d[i + 1] === q[1] && d[i + 2] === q[2] && d[i + 3] > 0;
    const put = (i, h) => { if (!h) return; const q = hexRgb(h); d[i] = q[0]; d[i + 1] = q[1]; d[i + 2] = q[2]; };
    const rows = Math.ceil(c.height / s.fh);
    for (let fy = 0; fy < rows; fy++) for (let fx = 0; fx < s.cols; fx++) {
      const ox = fx * s.fw, oy = fy * s.fh, body = [], sleeve = [];
      let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
      for (let yy = 0; yy < s.fh; yy++) for (let xx = 0; xx < s.fw; xx++) {
        const i = ((oy + yy) * W2 + ox + xx) * 4;
        if (is(i, top) || is(i, topD)) { body.push([xx, yy, i]); x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy); }
        else if (arm && is(i, arm)) sleeve.push([xx, yy, i]);
      }
      if (body.length < 12) continue;
      const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0), sd = K.sashDir === -1 ? -1 : 1;
      body.forEach(([xx, yy, i]) => {
        const u = (xx - x0) / w, v = (yy - y0) / h, uu = sd > 0 ? u : 1 - u, dd = v - (uu * 0.95 + 0.02);
        if (K.sash && Math.abs(dd) < 0.13) put(i, K.sash[0]);
        else if (K.sash && dd >= 0.13 && dd < 0.2) put(i, K.sash[1]);
        else if (K.collar && v < 0.5 && u > 0.45 && Math.abs(u - (1 - v * 1.1)) < 0.1) put(i, K.collar);
        else if (K.seam && Math.abs(u - 0.62) < 0.08 && v > 0.15) put(i, K.seam);
        else if (K.emblem && v > 0.18 && v < 0.36 && u > 0.55 && u < 0.85) put(i, (xx + yy) % 2 ? K.emblem[0] : K.emblem[1] || K.emblem[0]);
        else if (K.hem && v > 0.82) put(i, K.hem);
      });
      if (K.cuff) sleeve.forEach(([xx, yy, i]) => { const n = [i + W2 * 4, i + 4, i - 4]; if (n.some(j => j >= 0 && j < d.length && is(j, edge))) put(i, K.cuff); });
    }
    x.putImageData(im, 0, 0);
  }
  HD.cloth = cloth;
  const _bake = art.bake;
  art.bake = function (sid, cfg, set) {
    if (!HD.on || !owner[sid] || !cfg) return _bake.apply(this, arguments);
    const [id, kind] = owner[sid], d = L[id];
    const c2 = dressCfg(id, kind, cfg);
    const r = _bake.call(this, sid, c2, set);
    const K = kind === 'aw' ? (d.awCloth || d.cloth) : d.cloth;
    try { cloth(sid, art.sheets[sid] && art.sheets[sid].cfg, K); } catch (e) { console.error('hero-dress cloth', id, e); }
    return r;
  };
  // the dressed looks take hold at the first bake (art.init); a look added later is applied with HD.rebake(id)
  HD.rebake = function (id) {
    mapSheets();
    const h = D.heroes[id]; if (!h) return;
    [h.sheet, h.sheetArmed, h.sheetAw].forEach(sid => { const s = sid && art.sheets[sid]; if (!s || !s.cfg) return; const have = Object.keys(s.anims || {}).sort().join(','); let set = 'hero'; for (const k of Object.keys(art.SETS || {})) if (art.SETS[k].slice().sort().join(',') === have) set = k; art.bake(sid, s.cfg, set); });
  };
  const _init = art.init;
  art.init = function () {   // (js/art.js bakes the first heroes with its own local bake, which this hook never sees: rebake them after)
    mapSheets(); const r = _init.apply(this, arguments);
    if (HD.on) Object.keys(L).forEach(id => { try { HD.rebake(id); } catch (e) { console.error('hero-dress', id, e); } });
    return r;
  };
  mapSheets();
})();
