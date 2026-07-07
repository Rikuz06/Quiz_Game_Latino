# Original User Request

## Initial Request — 2026-07-07T10:11:58+02:00

An interactive Latin-to-Italian vocabulary trainer web application themed as a Gladiator Arena, designed for high-school students to practice Latin vocabulary. Correct translations deal damage to the active enemy gladiator, and wrong translations or time-outs cause the enemy to strike back and reduce the player's HP.

Working directory: `c:/Users/rpalu/Desktop/Quiz-latino-fracco`
Integrity mode: development

## Requirements

### R1. Gladiatorial Gameplay & Mechanics
- **Endless Survival Loop**: Players start with 100 HP. They face continuous waves of random Latin words. Correct answers deal damage to the enemy's HP; incorrect answers or time-outs deal damage to the player's HP.
- **Dynamic Difficulty Escalation**: Vocabulary difficulty scales dynamically with the player's score.
  - Level 1 (Score 0-5): Basic recognizable nouns (e.g. lupus, pater).
  - Level 2 (Score 6-15): Common verbs and adjectives.
  - Level 3 (Score 16-30): Complex third-declension words.
  - Level 4 (Score 31-50): Abstract nouns and irregular verbs.
  - Level 5 (Score 51+): High-level philosophical concepts.
- **Active Modifiers**:
  - Score > 15: "Tempus" countdown timer (12s down to 8s).
  - Score > 30: "Caecus" (letters are partially hidden by default).
  - Score > 45: "Double Damage" (fails hurt the player twice as much).
- **Crowd Favor & Special Abilities**: Correct answer streaks build a "Crowd Favor" gauge (0-100%). Players can trigger abilities via keyboard/button inputs:
  - *Scutum* (40% Favor): Absorbs the damage of the next wrong answer.
  - *Oracolo* (30% Favor): Reveals part of the translation as a clue.
  - *Gladius* (60% Favor): Instantly defeats the current word for double points.

### R2. Visual & Audio Aesthetics (Ancient Rome theme)
- **Roman Arena UI**: Design an immersive UI with imperial purple (#800020), crimson, gold border trims, and marble slab panels.
- **Typography**: Google Fonts "Cinzel" for headers to resemble stone engravings, and a highly readable Serif font for vocabulary cards.
- **Micro-animations**: Dynamic screen shake on damage, slash flashes on hits, and particle explosions on correct translations.
- **Procedural Sound**: Procedural Web Audio API synthesizer for retro sword swings, shields clanging, and crowd cheers (no external file assets).

### R3. Programmatic Verification
- **Automated Test Suite**: Create a headless browser test (using Puppeteer, Playwright, or equivalent Node-based runner) inside a `tests/` folder. The test must load `index.html`, simulate correct and incorrect answers, verify state changes (score, HP reduction, ability unlocks), and confirm that the Web Audio API context starts successfully on interaction.

## Acceptance Criteria

### Core Functionality
- [ ] The game operates in three main states: Start Screen, Active Battle, and Game Over Screen (with statistics like words defeated and max streak).
- [ ] At least 100 Latin-Italian vocabulary pairs are implemented across the 5 difficulty levels.
- [ ] Dynamic modifiers (timer, hidden letters) activate correctly at the specified score thresholds.
- [ ] Special abilities cost the correct amount of Crowd Favor and execute their specified effects (shielding damage, hinting, instant defeat).

### Aesthetics & Sound
- [ ] Symmetrical layout using imperial colors and marble/stone stylings.
- [ ] Procedural audio plays correctly upon user interaction (correct answer, incorrect answer, shield block, gladius slash).

### Verification
- [ ] The programmatic test suite in `tests/` passes successfully, testing at least one correct input flow, one incorrect input flow, and one modifier trigger.
