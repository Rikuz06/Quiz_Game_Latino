# Project: Gladiator Arena Vocabulary Trainer

## Architecture
This is a client-side Single Page Application (SPA) utilizing HTML5, CSS3, and modern JavaScript (ES6). No server-side backend is required, except for serving static assets.

- **UI & Layout**: Symmetrical, Roman-themed responsive layout with imperial colors and marble/stone stylings.
- **Game Engine**: Handles game states (Start, Battle, Game Over), HP/score management, active modifiers, and Crowd Favor.
- **Vocabulary Database**: Stores 100+ Latin-Italian vocabulary pairs classified across 5 difficulty levels.
- **Procedural Synthesizer**: Web Audio API-based audio generator producing retro sounds for sword swings, shield clanging, and crowd cheers on interaction.
- **E2E Testing Suite**: Automated tests using Puppeteer (or Playwright) simulating gameplay, input flows, modifier triggers, and Web Audio API initialization.

```
+-------------------------------------------------------------+
|                         HTML / CSS                          |
|         (Start Screen / Battle Screen / Game Over Screen)   |
+-------------------------------------------------------------+
                              ▲
                              │ Updates UI / Receives Input
                              ▼
+-------------------------------------------------------------+
|                          app.js                             |
|    (Game State, Modifiers, Crowd Favor, Special Abilities)  |
+-------------------------------------------------------------+
          │                                         │
          ├───────── Reads Vocab                    ├───────── Plays Audio
          ▼                                         ▼
+----------------───+                     +----------------───+
|      vocab.js     |                     |      sound.js     |
| (100+ Words L1-5) |                     |  (Web Audio API)  |
+───────────────────+                     +───────────────────+
```

## Milestones
| # | Name | Scope | Dependencies | Status | Conv ID |
|---|------|-------|-------------|--------|---------|
| M1 | Static UI & Styling | HTML/CSS markup, imperial layout, marble panels, fonts | None | PLANNED | TBD |
| M2 | Core Gameplay Loop | app.js/vocab.js: basic loop, HP/damage, word generation | M1 | PLANNED | TBD |
| M3 | Dynamic Difficulty | level transitions (1-5), modifiers (timer, hidden chars) | M2 | PLANNED | TBD |
| M4 | Crowd Favor & Abilities | gauge, Scutum, Oracolo, Gladius abilities & hotkeys | M3 | PLANNED | TBD |
| M5 | Audio & Micro-animations | sound.js: Web Audio synth, screen shake, particles | M4 | PLANNED | TBD |
| M6 | E2E Verification & Hardening | Pass E2E test suite, adversarial Tier 5 coverage | M5, T3 | PLANNED | TBD |

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
- Exported namespace/class: `RomanArenaAudio`
- Methods:
  - `init()`: Starts/resumes Web Audio context on user interaction.
  - `playCorrect()`: Plays retro sword swing / slash sound.
  - `playIncorrect()`: Plays damage/enemy hit sound.
  - `playShield()`: Plays shield clang/absorb sound.
  - `playGladius()`: Plays extra powerful gladius strike sound.
  - `playCheer()`: Plays crowd cheering sound.

## Code Layout
- `/index.html` - Core HTML document
- `/styles.css` - Custom styling and micro-animations
- `/js/vocab.js` - Vocab list and retrieval utility
- `/js/sound.js` - Web Audio API procedural sound synthesizer
- `/js/app.js` - Core application logic, game states, modifier engines, UI binding
- `/tests/` - Headless browser tests (Puppeteer/Jest)
- `/package.json` - Node dependencies and scripts
