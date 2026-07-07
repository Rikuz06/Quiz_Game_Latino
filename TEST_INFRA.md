# Test Infrastructure Architecture: Gladiator Arena Vocabulary Trainer

This document specifies the comprehensive test strategy, verification architecture, and the complete inventory of 71 test cases covering Tiers 1–4 for the Gladiator Arena Vocabulary Trainer application.

---

## 1. Test Philosophy

The Gladiator Arena Vocabulary Trainer verification suite is designed around two core principles:

### Opaque-Box (Black-Box) Testing
The test suite treats the application as an opaque system. It does not inspect or manipulate internal JavaScript variables, state engines, or in-memory database structures directly. Instead, all test cases interact with the application solely through the public Document Object Model (DOM) and simulated user actions, such as:
- Simulating mouse clicks on UI elements.
- Simulating keyboard inputs (e.g., typing translations, pressing `Enter`).
- Simulating hotkey combinations for triggering special abilities (`S`, `O`, `G`).
- Inspecting DOM elements, text content, CSS visibility classes, and custom `data-*` attributes to assert state.

### Requirement-Driven Design
Every test case in this document is mapped directly to the functional and non-functional requirements specified in the project scope (`ORIGINAL_REQUEST.md`). The test suite validates:
- **Core Gameplay Loops**: Transitioning between Start, Battle, and Game Over states.
- **Combat Mechanics**: Tracking HP, scores, streaks, damage calculations, and player death.
- **Dynamic Difficulty**: Real-time adjustment of word lists based on score.
- **Active Modifiers**: Timers, word masking, and damage scaling.
- **Crowd Favor**: Special ability activation, cost deduction, and gameplay effects.
- **Audio Integrity**: Event-driven Web Audio context lifecycle verification.

---

## 2. Feature Inventory

The test suite validates 6 core features across 4 distinct testing tiers:

1. **Game State Management** (Start, Battle, Game Over, Restart)
2. **Combat & HP Loop** (Correct/incorrect answer damage, score tracking, player death)
3. **Dynamic Difficulty Escalation** (Score thresholds for Levels 1–5)
4. **Active Modifiers** (Tempus timer, Caecus hidden letters, Double Damage)
5. **Crowd Favor & Special Abilities** (Streak tracking, Scutum, Oracolo, Gladius abilities)
6. **Web Audio API** (Web Audio context initialization and event triggers)

### Testing Tiers Mapping
- **Tier 1 (Happy-Path)**: 30 cases (5 per feature). Verifies correct behavior under ideal conditions.
- **Tier 2 (Boundary & Error Cases)**: 30 cases (5 per feature). Verifies resilience, invalid inputs, edge-case thresholds, and failure states.
- **Tier 3 (Pairwise Integration)**: 6 cases. Verifies interactions between two different features.
- **Tier 4 (Real-World Workloads)**: 5 cases. Simulates full end-to-end user journeys and complex game sessions.

Total Test Cases: **exactly 71**.

---

## 3. Test Architecture

The automated test runner uses **Jest** as the test framework and runner, combined with **Puppeteer** to execute the tests inside a headless Chrome browser.

```
+-----------------------------------------------------------+
|                        Jest Runner                        |
|   (Executes test suites, coordinates lifecycle hooks)     |
+-----------------------------------------------------------+
                              │
                              ▼
+-----------------------------------------------------------+
|                     Puppeteer Browser                     |
|  (Loads index.html, simulates user mouse/keyboard input)  |
+-----------------------------------------------------------+
                              │
                              ▼
+-----------------------------------------------------------+
|                    Application DOM                        |
|  (Renders UI, triggers sound events, updates attributes)  |
+-----------------------------------------------------------+
```

### Headless Web Audio Verification Contract
Since headless browsers run without native sound output, the test suite verifies Web Audio API events by inspecting custom attributes on the `<body>` element. The frontend application is required to set and update these attributes dynamically:
- `data-audio-state`: Reflects the current state of the `AudioContext` (`"suspended"`, `"running"`, or `"error"`).
- `data-audio-last-played`: Reflects the last sound effect triggered by the procedural synthesizer (`"correct"`, `"incorrect"`, `"shield"`, `"gladius"`, `"cheer"`).

### Selectors Contract
To maintain strict separation between testing and UI styling, the application must implement the following DOM selectors exactly:

| Selector | Element Type | Description |
|---|---|---|
| `#start-screen` | Container | Start screen view |
| `#battle-screen` | Container | Active gameplay/battle view |
| `#game-over-screen` | Container | Game over statistics view |
| `#btn-start` | Button | Starts the game from the Start screen |
| `#btn-restart` | Button | Restarts the game from the Game Over screen |
| `#latin-word` | Text Container | Displays the active Latin word (may contain masked letters) |
| `#input-answer` | Input Field | Text input for the Italian translation |
| `#btn-submit` | Button | Submits the typed translation |
| `#player-hp` | Text/Number | Displays player's current numerical HP |
| `#player-hp-bar` | Gauge / Bar | Visual representation of player's HP (e.g., width or value attribute) |
| `#enemy-hp` | Text/Number | Displays active enemy gladiator's numerical HP |
| `#player-score` | Text/Number | Displays current player score |
| `#player-streak` | Text/Number | Displays current correct answer streak |
| `#level-display` | Text/Number | Displays active difficulty level (Level 1–5) |
| `#crowd-favor-bar` | Gauge / Bar | Visual representation of Crowd Favor (0–100%) |
| `#btn-ability-scutum` | Button | Activates Scutum ability |
| `#btn-ability-oracolo` | Button | Activates Oracolo ability |
| `#btn-ability-gladius` | Button | Activates Gladius ability |
| `#status-scutum-active` | Indicator | Exists or becomes visible when Scutum shield is active |
| `#modifier-tempus` | Indicator | Visible when the Tempus timer is active |
| `#timer-countdown` | Text/Number | Displays remaining seconds of the Tempus timer |
| `#modifier-caecus` | Indicator | Visible when the Caecus hidden letters modifier is active |
| `#modifier-double-damage`| Indicator | Visible when the Double Damage modifier is active |
| `#clue-display` | Text Container | Displays clues/hints revealed by Oracolo |
| `#stats-words-defeated` | Text/Number | Game Over stat: Total words solved |
| `#stats-max-streak` | Text/Number | Game Over stat: Maximum streak achieved |
| `#stats-final-score` | Text/Number | Game Over stat: Final score reached |

---

## 4. Complete List of the 71 Test Cases

### Tier 1: Happy-Path Cases (30 Cases)

#### Feature 1: Game State Management (T1-F1)
- **TC-1.1.1**: **Start to Battle Screen Transition**
  - *Description*: Verify that clicking the start button transitions the UI from the Start Screen to the active Battle Screen.
  - *Inputs*: Load application, click `#btn-start`.
  - *Expected Outcomes*: `#start-screen` is hidden (has CSS class `hidden` or `display: none`), `#battle-screen` is visible, and the first word is loaded in `#latin-word`.
- **TC-1.1.2**: **Battle to Game Over Transition**
  - *Description*: Verify that the game transitions to the Game Over Screen when player HP reaches 0.
  - *Inputs*: Start game, submit incorrect answers until player HP reaches 0.
  - *Expected Outcomes*: `#battle-screen` is hidden, `#game-over-screen` is visible, and player HP is 0.
- **TC-1.1.3**: **Restart Game Transition**
  - *Description*: Verify that clicking restart on the Game Over screen returns the user to a fresh Battle Screen.
  - *Inputs*: Click `#btn-restart` on the Game Over screen.
  - *Expected Outcomes*: `#game-over-screen` is hidden, `#battle-screen` is visible, player HP resets to 100, and score/streak reset to 0.
- **TC-1.1.4**: **Initial Screen State on Load**
  - *Description*: Verify that only the Start Screen is visible upon initial page load.
  - *Inputs*: Load `index.html`.
  - *Expected Outcomes*: `#start-screen` is visible, `#battle-screen` is hidden, `#game-over-screen` is hidden.
- **TC-1.1.5**: **Visual Reset on Fresh Game**
  - *Description*: Verify that starting a new game clears any visual residuals (e.g., clue text, active abilities) from previous runs.
  - *Inputs*: Transition to Game Over, click `#btn-restart`.
  - *Expected Outcomes*: `#clue-display` is empty, no ability indicators (e.g. `#status-scutum-active`) are active, and modifier indicators are hidden.

#### Feature 2: Combat & HP Loop (T1-F2)
- **TC-1.2.1**: **Correct Answer Scoring and Damage**
  - *Description*: Verify that submitting a correct answer increases score, damages the enemy, and loads a new word.
  - *Inputs*: Type correct translation in `#input-answer` and click `#btn-submit`.
  - *Expected Outcomes*: Player score `#player-score` increments by 1, enemy HP decreases, and a new word loads.
- **TC-1.2.2**: **Incorrect Answer Player Damage**
  - *Description*: Verify that submitting an incorrect answer inflicts damage on the player and resets the streak.
  - *Inputs*: Type an incorrect translation in `#input-answer` and click `#btn-submit`.
  - *Expected Outcomes*: Player HP `#player-hp` decreases by the standard amount (e.g., 15 HP), and `#player-streak` is set to 0.
- **TC-1.2.3**: **Streak Counter Accumulation**
  - *Description*: Verify that consecutive correct answers increment the active streak counter.
  - *Inputs*: Submit two correct translations in a row.
  - *Expected Outcomes*: `#player-streak` displays "2".
- **TC-1.2.4**: **HP Bar Visual Sync**
  - *Description*: Verify that the player's HP bar width or value adjusts proportionally to damage taken.
  - *Inputs*: Submit an incorrect answer to trigger damage.
  - *Expected Outcomes*: Visual bar `#player-hp-bar` updates to match the new numerical HP percentage.
- **TC-1.2.5**: **Game Over Stats Display**
  - *Description*: Verify that the final stats on the Game Over screen match the achievements of the run.
  - *Inputs*: Score 3 points and reach a max streak of 3, then get answers wrong until HP is 0.
  - *Expected Outcomes*: `#stats-words-defeated` shows "3", `#stats-max-streak` shows "3", `#stats-final-score` shows "3".

#### Feature 3: Dynamic Difficulty Escalation (T1-F3)
- **TC-1.3.1**: **Level 1 Word Bounds**
  - *Description*: Verify that at score 0-5, words served are Level 1 (basic nouns).
  - *Inputs*: Start game (score 0), answer correctly up to score 5.
  - *Expected Outcomes*: `#level-display` displays "Level 1" and words are pulled from Level 1 vocab.
- **TC-1.3.2**: **Level 2 Transition**
  - *Description*: Verify transition to Level 2 when score reaches 6.
  - *Inputs*: Correctly answer when score is 5 to reach score 6.
  - *Expected Outcomes*: `#level-display` displays "Level 2" and the next word is from the Level 2 list (verbs/adjectives).
- **TC-1.3.3**: **Level 3 Transition**
  - *Description*: Verify transition to Level 3 when score reaches 16.
  - *Inputs*: Correctly answer when score is 15 to reach score 16.
  - *Expected Outcomes*: `#level-display` displays "Level 3" and the next word is from the Level 3 list (complex third-declension).
- **TC-1.3.4**: **Level 4 Transition**
  - *Description*: Verify transition to Level 4 when score reaches 31.
  - *Inputs*: Correctly answer when score is 30 to reach score 31.
  - *Expected Outcomes*: `#level-display` displays "Level 4" and the next word is from the Level 4 list (abstract/irregular).
- **TC-1.3.5**: **Level 5 Transition**
  - *Description*: Verify transition to Level 5 when score reaches 51.
  - *Inputs*: Correctly answer when score is 50 to reach score 51.
  - *Expected Outcomes*: `#level-display` displays "Level 5" and the next word is from the Level 5 list (philosophical concepts).

#### Feature 4: Active Modifiers (T1-F4)
- **TC-1.4.1**: **Tempus Timer Activation**
  - *Description*: Verify that the Tempus timer starts ticking when the score is greater than 15.
  - *Inputs*: Reach score 16.
  - *Expected Outcomes*: `#modifier-tempus` becomes visible, and `#timer-countdown` begins counting down.
- **TC-1.4.2**: **Caecus Letter Masking Activation**
  - *Description*: Verify that Caecus obscures letters of the Latin word when the score is greater than 30.
  - *Inputs*: Reach score 31.
  - *Expected Outcomes*: `#modifier-caecus` is visible, and the Latin word shown has letters hidden (e.g. replaced by underscores).
- **TC-1.4.3**: **Double Damage Activation**
  - *Description*: Verify that Double Damage activates when the score is greater than 45.
  - *Inputs*: Reach score 46.
  - *Expected Outcomes*: `#modifier-double-damage` becomes visible, indicating that incorrect answers will inflict double damage.
- **TC-1.4.4**: **Tempus Timer Expiration Damage**
  - *Description*: Verify that letting the Tempus timer count down to 0 deals damage and loads a new word.
  - *Inputs*: Reach score 16, do not enter an answer, wait for `#timer-countdown` to reach 0.
  - *Expected Outcomes*: Player HP decreases by standard damage, streak resets to 0, and a new word loads.
- **TC-1.4.5**: **Double Damage Penalty Implementation**
  - *Description*: Verify that wrong answers deal double damage when the modifier is active.
  - *Inputs*: Reach score 46, submit an incorrect answer.
  - *Expected Outcomes*: Player HP decreases by 30 HP instead of the standard 15 HP.

#### Feature 5: Crowd Favor & Special Abilities (T1-F5)
- **TC-1.5.1**: **Crowd Favor Gauge Accumulation**
  - *Description*: Verify that correct answers build the Crowd Favor gauge.
  - *Inputs*: Submit a correct answer.
  - *Expected Outcomes*: `#crowd-favor-bar` visual indicator/value increases.
- **TC-1.5.2**: **Scutum Activation and Cost Deduct**
  - *Description*: Verify that Scutum activates and deducts 40% Favor.
  - *Inputs*: Build Crowd Favor to 50%, click `#btn-ability-scutum` (or press keyboard key `S`).
  - *Expected Outcomes*: Crowd Favor drops to 10%, `#status-scutum-active` becomes visible/active.
- **TC-1.5.3**: **Oracolo Clue Activation**
  - *Description*: Verify that Oracolo activates, deducts 30% Favor, and displays a clue.
  - *Inputs*: Build Crowd Favor to 30%, click `#btn-ability-oracolo` (or press keyboard key `O`).
  - *Expected Outcomes*: Crowd Favor drops to 0%, `#clue-display` shows a translation clue/partial letters.
- **TC-1.5.4**: **Gladius Auto-Defeat Activation**
  - *Description*: Verify that Gladius activates, deducts 60% Favor, defeats the current word, and yields double points.
  - *Inputs*: Build Crowd Favor to 65%, click `#btn-ability-gladius` (or press keyboard key `G`).
  - *Expected Outcomes*: Crowd Favor drops to 5%, current word is marked correct, and score increases by 2.
- **TC-1.5.5**: **Scutum Damage Mitigation**
  - *Description*: Verify that Scutum absorbs the next incorrect answer's damage.
  - *Inputs*: Activate Scutum, submit an incorrect answer.
  - *Expected Outcomes*: Player HP remains unchanged, `#status-scutum-active` is removed.

#### Feature 6: Web Audio API (T1-F6)
- **TC-1.6.1**: **Autoplay Prevention Compliance**
  - *Description*: Verify that the Web Audio context starts as suspended before user interaction.
  - *Inputs*: Load page, check `body` attributes before clicking.
  - *Expected Outcomes*: `data-audio-state` is `"suspended"`.
- **TC-1.6.2**: **Interactive Audio Initialization**
  - *Description*: Verify that the audio context starts running upon clicking the start button.
  - *Inputs*: Click `#btn-start`.
  - *Expected Outcomes*: `data-audio-state` updates to `"running"`.
- **TC-1.6.3**: **Correct Translation Sound Playback**
  - *Description*: Verify that a correct answer triggers the correct sound event.
  - *Inputs*: Submit a correct answer.
  - *Expected Outcomes*: `data-audio-last-played` is `"correct"`.
- **TC-1.6.4**: **Incorrect Translation Sound Playback**
  - *Description*: Verify that an incorrect answer triggers the incorrect sound event.
  - *Inputs*: Submit an incorrect answer.
  - *Expected Outcomes*: `data-audio-last-played` is `"incorrect"`.
- **TC-1.6.5**: **Shield Clang Sound Playback**
  - *Description*: Verify that activating Scutum triggers the shield clang sound event.
  - *Inputs*: Activate Scutum.
  - *Expected Outcomes*: `data-audio-last-played` is `"shield"`.

---

### Tier 2: Boundary & Error Cases (30 Cases)

#### Feature 1: Game State Management (T2-F1)
- **TC-2.1.1**: **Ignore Submit on Start Screen**
  - *Description*: Verify that attempting to submit answers while on the Start screen has no effect.
  - *Inputs*: Focus and trigger Enter on `#input-answer` or click `#btn-submit` while Start screen is visible.
  - *Expected Outcomes*: Score remains 0, HP remains 100, and game remains on Start screen.
- **TC-2.1.2**: **Ignore Submit on Game Over Screen**
  - *Description*: Verify that typing/submitting answers is disabled on the Game Over screen.
  - *Inputs*: Attempt to submit a translation after HP reaches 0.
  - *Expected Outcomes*: No score increments, no new words load, and stats remain frozen.
- **TC-2.1.3**: **De-duplicate Rapid Start Clicks**
  - *Description*: Verify that rapid consecutive clicks on the start button do not initialize duplicate game interval timers.
  - *Inputs*: Rapidly click `#btn-start` 5 times within 200ms.
  - *Expected Outcomes*: Only a single game loop executes; timer ticks down at normal rate, and only one word is loaded.
- **TC-2.1.4**: **De-duplicate Rapid Restart Clicks**
  - *Description*: Verify that rapid consecutive clicks on the restart button do not trigger multiple resets.
  - *Inputs*: Rapidly click `#btn-restart` 5 times within 200ms.
  - *Expected Outcomes*: A single game session starts. HP resets exactly once to 100, score to 0.
- **TC-2.1.5**: **Page Reload Hard Reset**
  - *Description*: Verify that reloading the browser tab completely resets all active states, scores, and active modifiers.
  - *Inputs*: Reload browser tab.
  - *Expected Outcomes*: Game returns to Start screen, all values reset to default (score = 0, HP = 100, modifiers inactive).

#### Feature 2: Combat & HP Loop (T2-F2)
- **TC-2.2.1**: **Lethal Damage Cap**
  - *Description*: Verify that taking damage that drops HP below 0 caps HP at exactly 0 and transitions to Game Over.
  - *Inputs*: Player HP is 10, submit a wrong answer (damage = 15).
  - *Expected Outcomes*: Player HP display `#player-hp` reads 0 (not -5), and `#game-over-screen` is displayed.
- **TC-2.2.2**: **Empty Input Submission**
  - *Description*: Verify that submitting a blank string or space-only input is graded as incorrect and inflicts player damage.
  - *Inputs*: Focus `#input-answer`, press space bar once, click `#btn-submit`.
  - *Expected Outcomes*: Player HP decreases by 15, streak is reset to 0.
- **TC-2.2.3**: **Input Sanitization (Spaces & Case)**
  - *Description*: Verify that translations with incorrect casing or extra spaces are trimmed and accepted.
  - *Inputs*: For Latin word "pater" (translation "padre"), type "   PaDrE  " and submit.
  - *Expected Outcomes*: Score increments by 1, word is graded correct, and player HP remains unchanged.
- **TC-2.2.4**: **Submit Button Double-Click Protection**
  - *Description*: Verify that clicking the submit button twice in rapid succession does not grade the word twice or cause double damage.
  - *Inputs*: Double-click `#btn-submit` within 50ms for a correct answer.
  - *Expected Outcomes*: Score increments by exactly 1, and only one new word is loaded.
- **TC-2.2.5**: **HP Capped at Maximum (100)**
  - *Description*: Verify that player HP cannot exceed 100 under any circumstances.
  - *Inputs*: Player HP is 100. Submit correct answers.
  - *Expected Outcomes*: Numerical display `#player-hp` remains exactly 100.

#### Feature 3: Dynamic Difficulty Escalation (T2-F3)
- **TC-2.3.1**: **Level 1 Upper Boundary**
  - *Description*: Verify that when score is exactly 5, words are still pulled from Level 1.
  - *Inputs*: Reach score 5.
  - *Expected Outcomes*: `#level-display` displays "Level 1", and the next word is a Level 1 word.
- **TC-2.3.2**: **Level 2 Lower Boundary**
  - *Description*: Verify that when score is exactly 6, words are pulled from Level 2.
  - *Inputs*: Score transitions from 5 to 6.
  - *Expected Outcomes*: `#level-display` displays "Level 2", and the next word is a Level 2 word.
- **TC-2.3.3**: **Level 2 Upper Boundary**
  - *Description*: Verify that when score is exactly 15, words are still pulled from Level 2.
  - *Inputs*: Reach score 15.
  - *Expected Outcomes*: `#level-display` displays "Level 2", and the next word is a Level 2 word.
- **TC-2.3.4**: **Level 3 Upper Boundary**
  - *Description*: Verify that when score is exactly 30, words are still pulled from Level 3.
  - *Inputs*: Reach score 30.
  - *Expected Outcomes*: `#level-display` displays "Level 3", and the next word is a Level 3 word.
- **TC-2.3.5**: **Level 4 Upper Boundary**
  - *Description*: Verify that when score is exactly 50, words are still pulled from Level 4.
  - *Inputs*: Reach score 50.
  - *Expected Outcomes*: `#level-display` displays "Level 4", and the next word is a Level 4 word.

#### Feature 4: Active Modifiers (T2-F4)
- **TC-2.4.1**: **Tempus Activation Score Boundary**
  - *Description*: Verify that the Tempus timer is inactive at score 15 but activates immediately at score 16.
  - *Inputs*: Reach score 15 (observe no timer), then reach score 16.
  - *Expected Outcomes*: `#modifier-tempus` is hidden at score 15, and is visible and counting down at score 16.
- **TC-2.4.2**: **Caecus Activation Score Boundary**
  - *Description*: Verify that Caecus is inactive at score 30 but activates immediately at score 31.
  - *Inputs*: Reach score 30 (observe full word), then reach score 31.
  - *Expected Outcomes*: `#modifier-caecus` is hidden at score 30, and is visible at score 31 (partially masking `#latin-word`).
- **TC-2.4.3**: **Double Damage Score Boundary**
  - *Description*: Verify that Double Damage is inactive at score 45 but activates immediately at score 46.
  - *Inputs*: Score = 45 (wrong answer deals standard damage), reach score 46, submit incorrect answer.
  - *Expected Outcomes*: Standard damage (15 HP) is dealt at score 45. Double damage (30 HP) is dealt at score 46.
- **TC-2.4.4**: **Tempus Reset on Correct Answer**
  - *Description*: Verify that submitting a correct answer resets the Tempus timer back to its maximum duration for the next word.
  - *Inputs*: Score = 16. Wait for timer to reach 2s, then submit the correct translation.
  - *Expected Outcomes*: A new word is served, and `#timer-countdown` starts back at 12s.
- **TC-2.4.5**: **Tempus Duration Minimum Limit**
  - *Description*: Verify that the timer duration scales down to a minimum of 8s at score 50 and does not scale lower.
  - *Inputs*: Reach score 50 (observe timer duration), then reach score 60 and observe timer duration.
  - *Expected Outcomes*: Countdown starts at 8 seconds at score 50, and remains starting at 8 seconds at score 60.

#### Feature 5: Crowd Favor & Special Abilities (T2-F5)
- **TC-2.5.1**: **Block Scutum below 40% Favor**
  - *Description*: Verify that attempting to activate Scutum with less than 40% Crowd Favor is blocked.
  - *Inputs*: Crowd Favor is 35%. Click `#btn-ability-scutum` or press `S`.
  - *Expected Outcomes*: Activation is ignored, Favor remains 35%, and `#status-scutum-active` is not visible.
- **TC-2.5.2**: **Block Oracolo below 30% Favor**
  - *Description*: Verify that attempting to activate Oracolo with less than 30% Crowd Favor is blocked.
  - *Inputs*: Crowd Favor is 25%. Click `#btn-ability-oracolo` or press `O`.
  - *Expected Outcomes*: Activation is ignored, Favor remains 25%, and `#clue-display` remains empty.
- **TC-2.5.3**: **Block Gladius below 60% Favor**
  - *Description*: Verify that attempting to activate Gladius with less than 60% Crowd Favor is blocked.
  - *Inputs*: Crowd Favor is 55%. Click `#btn-ability-gladius` or press `G`.
  - *Expected Outcomes*: Activation is ignored, Favor remains 55%, and the current word is not defeated.
- **TC-2.5.4**: **Crowd Favor Cap at 100%**
  - *Description*: Verify that the Crowd Favor gauge cannot exceed 100% on high correct streaks.
  - *Inputs*: Answer correctly on a 15-game correct streak.
  - *Expected Outcomes*: Crowd Favor gauge display remains capped at exactly 100%.
- **TC-2.5.5**: **No Stack on Consecutive Shield Activations**
  - *Description*: Verify that activating Scutum while a shield is already active does not consume additional Crowd Favor.
  - *Inputs*: Reach 90% Crowd Favor, activate Scutum (favor drops to 50%), click `#btn-ability-scutum` again.
  - *Expected Outcomes*: Second click is ignored, favor remains at 50%, and shield count/status remains 1.

#### Feature 6: Web Audio API (T2-F6)
- **TC-2.6.1**: **Gladius Sound Event**
  - *Description*: Verify that successfully triggering the Gladius ability plays the Gladius slash sound.
  - *Inputs*: Build Crowd Favor to 60%, activate Gladius.
  - *Expected Outcomes*: `data-audio-last-played` updates to `"gladius"`.
- **TC-2.6.2**: **Crowd Cheer Sound Event**
  - *Description*: Verify that reaching a streak of 5 correct answers triggers the crowd cheering sound.
  - *Inputs*: Reach a correct answer streak of 5.
  - *Expected Outcomes*: `data-audio-last-played` updates to `"cheer"`.
- **TC-2.6.3**: **AudioContext Exception Fallback**
  - *Description*: Verify that the game does not crash if `window.AudioContext` throws an initialization error.
  - *Inputs*: Mock `AudioContext` constructor to throw an error, click `#btn-start`, play game.
  - *Expected Outcomes*: Game plays normally, `data-audio-state` is set to `"error"`, and no unhandled JavaScript errors break the application.
- **TC-2.6.4**: **AudioContext Reuse on Restart**
  - *Description*: Verify that restarting the game does not create a new `AudioContext` instance.
  - *Inputs*: Start game, trigger Game Over, click `#btn-restart`.
  - *Expected Outcomes*: Only one `AudioContext` instance remains instantiated, preventing resource leaks.
- **TC-2.6.5**: **Rapid Multi-Sound Throttle**
  - *Description*: Verify that rapid sequential sound requests do not cause buffer overflow or console exceptions.
  - *Inputs*: Submit 10 answers (correct/incorrect) in extremely rapid succession (within 500ms).
  - *Expected Outcomes*: All requests process cleanly, and no exceptions are logged in the console.

---

### Tier 3: Pairwise Combinations (6 Cases)

- **TC-3.1**: **F1 (Game State) x F4 (Active Modifiers) — Restart Clears Active Modifiers**
  - *Description*: Verifies that when a game ends with active modifiers (e.g., Tempus active, Caecus active) and the player restarts, all active modifiers are cleared on the new run.
  - *Inputs*: Score is 32 (Tempus and Caecus active). Wait for HP to drop to 0. Click `#btn-restart`.
  - *Expected Outcomes*: Score is reset to 0, level is Level 1, `#modifier-tempus` and `#modifier-caecus` are hidden/inactive, and words are fully visible with no timer running.
- **TC-3.2**: **F2 (Combat Loop) x F5 (Crowd Favor) — Scutum Protects HP but Resets Streak**
  - *Description*: Verifies that when the Scutum shield is active, an incorrect answer is absorbed (HP is not reduced), the shield is consumed, but the player's answer streak is still reset to 0.
  - *Inputs*: Active streak is 5, Scutum is active. Submit an incorrect translation.
  - *Expected Outcomes*: Player HP remains unchanged, `#status-scutum-active` is removed, and `#player-streak` is reset to 0.
- **TC-3.3**: **F3 (Dynamic Difficulty) x F4 (Active Modifiers) — Level Transition Tempus Kickoff**
  - *Description*: Verifies that transitioning from Level 2 to Level 3 (score 16) immediately initializes and displays the Tempus timer for the newly loaded Level 3 word.
  - *Inputs*: Score is 15. Submit a correct answer.
  - *Expected Outcomes*: Score becomes 16, level displays "Level 3", and `#modifier-tempus` immediately activates, beginning its countdown from 12s on the new word.
- **TC-3.4**: **F4 (Active Modifiers) x F5 (Crowd Favor) — Oracolo Counteracts Caecus**
  - *Description*: Verifies that when the Caecus modifier is hiding letters of the Latin word, activating the Oracolo ability reveals a clue that counteracts the obscured letters.
  - *Inputs*: Score = 31 (Caecus active, word is partially masked). Crowd Favor is 30%. Activate Oracolo.
  - *Expected Outcomes*: Clue display `#clue-display` displays the clue, helping the user solve the masked word.
- **TC-3.5**: **F5 (Crowd Favor) x F6 (Web Audio API) — Gladius Sound and Point Double Trigger**
  - *Description*: Verifies that activating the Gladius ability instantly defeats the word, adds 2 points to the score, and triggers the `playGladius()` sound effect.
  - *Inputs*: Score is 10. Crowd Favor is 60%. Activate Gladius.
  - *Expected Outcomes*: Score becomes 12, the current word is marked defeated, and `data-audio-last-played` is set to `"gladius"`.
- **TC-3.6**: **F2 (Combat Loop) x F6 (Web Audio API) — Incorrect Answer Damage Sound and Screen Shake**
  - *Description*: Verifies that an incorrect answer simultaneously inflicts player damage, plays the incorrect sound event, and triggers the UI screen shake animation.
  - *Inputs*: Submit an incorrect answer.
  - *Expected Outcomes*: Player HP decreases, `data-audio-last-played` becomes `"incorrect"`, and the battle container element temporarily receives the CSS class `.shake`.

---

### Tier 4: Real-World Application-Level Workloads (5 Cases)

- **TC-4.1**: **"The Champion's Run" (Perfect Play and Escalation)**
  - *Description*: Simulates a high-performing student who answers 20 questions correctly in a row, traversing from Level 1 to Level 3, managing the Tempus timer, accumulating 100% Crowd Favor, and executing the Gladius ability.
  - *Inputs*:
    1. Start the game.
    2. Submit correct answers for 15 consecutive words (score goes 0 -> 15).
    3. At score 16, Tempus timer activates. Submit 4 more correct answers quickly, resetting the timer each time.
    4. At score 20, Crowd Favor is at 100%. Press `G` to activate Gladius.
  - *Expected Outcomes*: Game transitions through Levels 1, 2, and 3. Tempus timer resets correctly on each answer. Gladius activation consumes 60% Crowd Favor, instantly defeats the 21st word, adds 2 points (score = 22), and triggers the gladius audio event. Player HP remains at 100.
- **TC-4.2**: **"The Clueless Recruit" (Struggle, Oracolo Clue Assist, and Defeat)**
  - *Description*: Simulates a student struggling with vocabulary who makes mistakes, builds a short streak, uses Oracolo to get a clue to pass a word, but ultimately runs out of time and dies.
  - *Inputs*:
    1. Start the game. Submit 3 incorrect answers consecutively (HP drops to 55).
    2. Submit 3 correct answers consecutively (score = 3, streak = 3, Crowd Favor = 30%).
    3. Activate Oracolo (Crowd Favor drops to 0%).
    4. View the revealed clue in `#clue-display`, type the correct answer and submit (score = 4).
    5. Score reaches 16 (via simulated sequence). Tempus timer activates.
    6. Let the Tempus timer expire (HP drops by 15).
    7. Submit consecutive incorrect answers until HP is 0.
  - *Expected Outcomes*: HP transitions down appropriately. Oracolo activates when favor is 30% and displays the clue. After HP hits 0, game transitions to Game Over screen, showing correct stats (score, max streak).
- **TC-4.3**: **"The Shielded Survivor" (Defensive Strategy)**
  - *Description*: Simulates a strategic student who prioritizes survival by repeatedly building Crowd Favor to 40% and activating Scutum to absorb subsequent errors.
  - *Inputs*:
    1. Start the game. Submit 4 correct answers consecutively (score = 4, streak = 4, Crowd Favor = 40%).
    2. Activate Scutum (Crowd Favor drops to 0%, Scutum status = active).
    3. Submit an incorrect answer (streak resets to 0, Scutum status = inactive).
    4. Submit 4 more correct answers (score = 8, streak = 4, Crowd Favor = 40%).
    5. Activate Scutum (Crowd Favor drops to 0%, Scutum status = active).
    6. Let the Tempus timer expire (if active) or submit a wrong answer.
  - *Expected Outcomes*: Throughout the entire sequence, player HP remains at 100 because all damage is absorbed by the Scutum shields. The game state remains Battle Screen.
- **TC-4.4**: **"The Panicked Gladiator" (Timer Pressure Handling)**
  - *Description*: Simulates a student who is playing under intense time pressure after score > 15, letting the timer run low, answering correctly at the last second, and occasionally taking timeout damage.
  - *Inputs*:
    1. Reach score 16 (Tempus active).
    2. For word 1: wait until timer is at 1 second, then submit the correct answer.
    3. For word 2: wait until timer is at 1 second, then submit the correct answer.
    4. For word 3: let the timer expire (0 seconds).
    5. For word 4: submit the correct answer immediately.
  - *Expected Outcomes*: At word 1 and 2, correct answers are accepted, score increases, and timer resets. At word 3, timer expires, player takes damage, streak is reset, and a new word loads. At word 4, the correct answer is accepted, score increases.
- **TC-4.5**: **"The Ultimate Comeback" (Full Game Lifecycle)**
  - *Description*: Simulates a complete, complex game lifecycle. The player reaches Level 4, experiences multiple modifiers (Tempus, Caecus), takes damage down to 10 HP, uses Oracolo to solve a difficult word, activates Gladius for double points, and finally dies and restarts.
  - *Inputs*:
    1. Start the game. Play correctly until score is 35 (Level 4, Tempus and Caecus active).
    2. Take damage from wrong answers and timeouts until HP is exactly 10.
    3. Use Oracolo (revealing a clue for the Caecus-obscured word).
    4. Answer correctly using the clue. Build streak back up to get 60% Crowd Favor.
    5. Activate Gladius to instantly defeat a difficult Level 4 word.
    6. Take lethal damage (HP reaches 0).
    7. View final stats on the Game Over screen.
    8. Click Restart.
  - *Expected Outcomes*: Player successfully transitions from Level 1 to Level 4. Modifiers and abilities function properly under low HP conditions. Game transitions to Game Over screen upon death, and restarting successfully re-initializes a fresh game with standard settings.

---

## 5. Run Setup Instructions

Follow these steps to configure and run the automated Puppeteer and Jest test suite.

### Step 1: Install Node.js
Ensure Node.js (v18 or higher recommended) and npm are installed on your machine.
Verify installation by running:
```bash
node -v
npm -v
```

### Step 2: Initialize Project and Install Dependencies
If not already initialized, create a `package.json` in the root folder, and install the required test packages:
```bash
npm init -y
npm install --save-dev jest puppeteer jest-puppeteer
```

### Step 3: Configure Jest-Puppeteer
Create a configuration file `jest-puppeteer.config.js` in the root directory:
```javascript
module.exports = {
  launch: {
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  server: {
    command: "npx servor . 8080 --verbo",
    port: 8080,
    launchTimeout: 10000,
    usedPortAction: "ignore",
  },
};
```
*(Alternatively, you can load the local index.html directly from the file system: `await page.goto('file:///' + path.resolve(__dirname, '../index.html'));`)*.

### Step 4: Configure Jest
Add a `jest.config.js` file to configure Jest to use the `jest-puppeteer` preset:
```javascript
module.exports = {
  preset: "jest-puppeteer",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
};
```

### Step 5: Add Test Scripts to `package.json`
Configure the test execution command by modifying the `scripts` section in `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

### Step 6: Executing the Suite
Execute the tests using the npm script:
```bash
npm test
```
This will launch headless Chromium, load the application, and execute the 71 test cases specified above.
