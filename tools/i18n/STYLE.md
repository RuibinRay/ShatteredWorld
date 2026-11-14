# Shattered Worlds — translation style guide

Languages: **es** = Spanish (neutral international Spanish, informal "tú", "ustedes" for plural, no "vosotros"),
**zh** = Simplified Chinese (mainland conventions, 简体中文).

The game is an original 16-bit pixel action RPG set in a broken future Earth: **Deepline** (an underground slum city),
**the Surface** (a desert wasteland of scrap towns), and **Aurelia** (a rich floating city). A corporation called
**Halcyon** experiments on people ("Subject 31" etc.) and steals their memories. Heroes wake with no memory and
recover it as **Memory Shards**. Tone: gritty, warm, a little wry; short sentences; plain words. Dialogue should sound
like people talking, not like a manual. Keep each character's voice (blunt, cheerful, formal, etc.).

## How the text is used

Every English string is looked up word for word at runtime, so the translation replaces it exactly. Some strings are
whole lines of dialogue or UI; some are **fragments** that the code glues together (for example `"Not enough "` +
`"Volt"` + `" - hold J + K to charge"`). Rules:

1. **Keep leading and trailing spaces exactly** as in the English (a fragment that starts with a space must start with
   a space). Fragments must still read sensibly when glued in the same order.
2. **Keep placeholders** `{0}`, `{1}` exactly; move them where the grammar needs them.
3. **Keep line breaks** (`\n`): same number of lines where possible (Chinese may use fewer).
4. **Keys and controls stay as they are**: J, K, L, U, I, O, W, A, S, D, E, Q, M, F9, Esc, Enter, "W + I", "S + U",
   "J + K", "(E)", "LT", "RB" etc. Never translate a key letter. Numbers stay numbers.
5. **ALL CAPS stays ALL CAPS** in Spanish (accents included: "CAÍDA"). Chinese has no case.
6. **Length**: menu labels, button hints and HUD text must stay short. Spanish should be no more than about 25%
   longer than the English; if a UI line is long, shorten wording rather than dropping meaning. Chinese should be concise.
7. If a string is clearly not player-facing text (code, an id, a font name), copy it unchanged into both languages.
8. Use the glossary (tools/i18n/glossary.json) for every name, place, ability, item and game term it contains, every
   time, in exactly that form. This matters: the game swaps hero names inside translated lines by searching for them.

## Characters the Spanish font can draw

The Spanish text is drawn with a small pixel font. It has ONLY these characters:
`A-Z a-z 0-9 á é í ó ú ü ñ Á É Í Ó Ú Ü Ñ ¿ ¡` and `. , ! ? : ; ' " - + / ( ) % * # = < > [ ] _ & ^ ~ |` and space.
So in Spanish: no em dash (use " - "), no curly quotes (use straight ' and "), no ellipsis character (use "..."),
no « ». Opening ¿ and ¡ are wanted.

Chinese is drawn with a normal system font, so full-width punctuation is right: ，。！？：；“”‘’……——（）

## Names

- **Spanish**: keep people's names and coined names as they are (Kael, Nyra, Halcyon, Deepline, Aurelia, Scrapton,
  Glowwild, Vharra). Translate descriptive names and titles ("The Kid from the Trash" → "El chico de la basura",
  "Old Metro" → "Metro Viejo", "Pit Arena" → "Arena del Foso"). Keep "Subject 31" style codes as "Sujeto 31".
- **Chinese**: transliterate people's names into short, natural Chinese names (2-3 characters, e.g. Kael → 凯尔).
  Translate descriptive names and titles. Coined place names: transliterate or translate, whichever reads better,
  but always the same way. "Subject 31" → "31号实验体".
- Ability names: translate into short, punchy names (2-6 Chinese characters; Spanish up to about 20 letters).
