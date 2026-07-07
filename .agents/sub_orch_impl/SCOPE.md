# Scope: Gladiator Arena Vocabulary Trainer Implementation (M1-M5)

## Architecture
This is a pure client-side web application consisting of a single page:
- `index.html`: Entry point, defines the layouts for the Start Screen, Battle Screen, and Game Over Screen.
- `styles.css`: Custom styled Roman Arena UI (crimson, imperial purple `#800020`, gold borders, marble textures, custom fonts) and micro-animations (screen shake, slash flashes, particle effects).
- `js/vocab.js`: Word database containing at least 100 Latin-Italian vocabulary pairs divided across 5 levels.
- `js/sound.js`: Web Audio API sound synthesizer for retro sounds.
- `js/app.js`: Core game engine managing game states, player HP (100), enemy HP (100 per word/enemy), score, difficulty levels, timers, modifiers, crowd favor, and special abilities.

## Milestones
| # | Name | Scope | Dependencies | Status | Conv ID |
|---|------|-------|-------------|--------|---------|
| M1 | Static UI & Styling | HTML structure & CSS theme (purple/gold/crimson, Cinzel font) | None | DONE | e8c32d2c, ec59e296, e8729138, 45eb4aa2, 067d29bb, 0d723203, e6acde64, 60f20dfc, a41c959b, 1744d1a6 |
| M2 | Core Gameplay Loop | app.js & vocab.js: 100+ words, basic state machine, HP/damage, answer input | M1 | DONE | 0cb40def, 44c68b63, f792ec8e, 931c49d6, 9f9a405e, 1c4e3af2, 7cbebe21 |
| M3 | Dynamic Difficulty | Level progression (1-5), modifiers (timer: 12s->8s, Caecus: hidden letters, Double Damage) | M2 | IN_PROGRESS | b66afa48 |
| M4 | Crowd Favor & Abilities | Favor gauge (0-100%), abilities (Scutum, Oracolo, Gladius), keyboard/button triggers | M3 | IN_PROGRESS | b66afa48 |
| M5 | Audio & Micro-animations | sound.js: Web Audio synth (sword swing, hit, shield clang, cheer), screen shake, slash flashes, particles | M4 | IN_PROGRESS | b66afa48 |

## Interface Contracts
### `vocab.js`
- Exported data: `vocabData` array of objects:
  ```javascript
  {
    latin: "lupus",
    italian: "lupo",
    level: 1, // 1 to 5
    clue: "Mammifero canide selvatico..." // Optional hint
  }
  ```
- Exported functions: `getWordByLevel(level)`: Returns a random word object for the given level.

### `sound.js`
- Exported class: `RomanArenaAudio`
- Methods:
  - `init()`: Starts/resumes Web Audio context on user interaction.
  - `playCorrect()`: Plays retro sword swing/slash sound.
  - `playIncorrect()`: Plays damage/enemy hit sound.
  - `playShield()`: Plays shield clang/absorb sound.
  - `playGladius()`: Plays extra powerful gladius strike sound.
  - `playCheer()`: Plays crowd cheering sound.
