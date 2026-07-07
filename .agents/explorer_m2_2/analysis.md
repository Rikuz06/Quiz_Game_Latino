# Game State Loop & Core Logic Design Analysis

This document provides the complete architectural design and code structure for the Gladiator Arena Vocabulary Trainer's core gameplay loop (Milestone M2) in `js/app.js`, aligning with the specifications in `PROJECT.md`, `ORIGINAL_REQUEST.md`, and the automated test requirements in `tests/gladiator.test.js`.

---

## 1. Game State Engine Design

The gameplay engine should be implemented as a state machine in `js/app.js` managing three major screens:
- **Start Screen** (`#start-screen`)
- **Battle Screen** (`#battle-screen`)
- **Game Over Screen** (`#game-over-screen`)

### State Transition Logic
```javascript
const States = {
  START: 'START',
  BATTLE: 'BATTLE',
  GAMEOVER: 'GAMEOVER'
};

let currentState = States.START;
```

#### Transition Functions
1. **`transitionTo(newState)`**:
   - Updates `currentState = newState`.
   - Modifies visibility of DOM containers by adding/removing the `hidden` class and adjusting `aria-hidden` attributes.
   - Adjusts accessibility states (e.g., focusing appropriate fields).

```javascript
function transitionTo(newState) {
  currentState = newState;
  
  const startScreen = document.getElementById('start-screen');
  const battleScreen = document.getElementById('battle-screen');
  const gameOverScreen = document.getElementById('game-over-screen');

  // Hide all screens initially
  startScreen.classList.add('hidden');
  startScreen.setAttribute('aria-hidden', 'true');
  battleScreen.classList.add('hidden');
  battleScreen.setAttribute('aria-hidden', 'true');
  gameOverScreen.classList.add('hidden');
  gameOverScreen.setAttribute('aria-hidden', 'true');

  switch (newState) {
    case States.START:
      startScreen.classList.remove('hidden');
      startScreen.setAttribute('aria-hidden', 'false');
      break;
    case States.BATTLE:
      battleScreen.classList.remove('hidden');
      battleScreen.setAttribute('aria-hidden', 'false');
      break;
    case States.GAMEOVER:
      gameOverScreen.classList.remove('hidden');
      gameOverScreen.setAttribute('aria-hidden', 'false');
      break;
  }
}
```

---

## 2. Player Stats Management & Lifecycle

Stats initialization and updates must be strictly bounded and capped to comply with E2E test expectations.

### Stats Variables
- `playerHP`: Int, 0 to 100. Starts at 100.
- `score`: Int, starts at 0. Determines difficulty and active modifiers.
- `streak`: Int, starts at 0. Resets on wrong answer, timeout, or blocked hit.
- `maxStreak`: Int, maximum streak achieved in the run.
- `wordsDefeated`: Int, count of defeated words (incremented on normal answers and Gladius abilities).
- `favor`: Int, 0 to 100. Starts at 0. Increments by 10 per correct answer.
- `scutumActive`: Boolean, indicates if a damage mitigation shield is active.

### Stats Lifecycle Rules

| Stat | Initial | Increment/Decrement Rules | Capping |
|---|---|---|---|
| **HP** | `100` | `-15` (normal damage), `-30` (Double Damage modifier), `0` (Scutum active) | `Math.max(0, Math.min(100, hp))` |
| **Score** | `0` | `+1` (correct answer), `+2` (Gladius ability) | No upper cap, lower cap `0` |
| **Streak** | `0` | `+1` (correct answer), reset to `0` on error/timeout/shield-absorb | No upper cap, lower cap `0` |
| **Favor** | `0` | `+10` (correct answer), `-40` (Scutum), `-30` (Oracolo), `-60` (Gladius) | `Math.max(0, Math.min(100, favor))` |

- **Death Trigger**: When `playerHP` falls to `0`, the game immediately calls `transitionTo(States.GAMEOVER)` and populates the stats panel:
  - `#stats-final-score` = `score`
  - `#stats-words-defeated` = `wordsDefeated`
  - `#stats-max-streak` = `maxStreak`

---

## 3. Answer Checking & Combat Logic

The answer submission loop handles user input sanitization, grading, damage calculation, and level-scaling word retrieval.

### Submission Handler
When `#answer-form` is submitted:
1. Prevent default form submission (`e.preventDefault()`).
2. Read the value of `#input-answer`.
3. Check state: if not in `BATTLE` or currently processing a transition, ignore input.
4. **Sanitize input**:
   - Trim leading/trailing whitespace: `let answer = rawInput.trim();`
   - Handle empty inputs: If `answer === ""`, treat as **incorrect**.
   - Case-insensitivity: Compare `answer.toLowerCase()` against the target translation `activeWord.italian.toLowerCase()`.

### Combat & Damage Resolution

#### On Correct Answer
- Play `correct` sound (or `cheer` sound if `streak + 1` is a multiple of 5).
- Increment `score` by 1, `streak` by 1, and `wordsDefeated` by 1.
- Update `maxStreak = Math.max(maxStreak, streak)`.
- Increment `favor` by 10 (capped at 100).
- Deal damage to the active enemy (reduce enemy HP by 25 or 34. If enemy HP <= 0, reset enemy HP to 100, randomize a new enemy name, and play `cheer` sound).
- Trigger a slash/hit flash on the enemy avatar by adding and removing `flash-active`/`flash-hit` on `#slash-flash`.
- Load the next word.

#### On Incorrect Answer (or Tempus timeout)
- **If `scutumActive` is true**:
  - Consume shield: `scutumActive = false`.
  - Hide `#status-scutum-active`.
  - Reset `streak` to 0.
  - Play `shield` clang sound.
  - Show feedback: `"Danno parato dallo Scutum!"`.
- **If `scutumActive` is false**:
  - Determine damage: `let damage = (score > 45) ? 30 : 15;`.
  - Decrement `playerHP` by `damage`.
  - Reset `streak` to 0.
  - Play `incorrect` damage sound.
  - Trigger screen shake by adding/removing `shake-damage` class on the `#arena-container`.
  - Show feedback: `"Nemico ti colpisce per X danni!"`.
  - Check if `playerHP <= 0`. If true, trigger Game Over.
- If player survives, load the next word.

---

## 4. UI Dynamics & Update Engine

To satisfy Puppeteer test selectors, the UI must be updated dynamically on every state change and action.

### Active Modifiers UI Binding

| Modifier | Trigger Condition | UI Updates Required |
|---|---|---|
| **Tempus** | `score > 15` | Show `#modifier-tempus` and `#timer-container`. Start countdown timer. |
| **Caecus** | `score > 30` | Show `#modifier-caecus`. Obscure alternate letters of `#latin-word` with `_`. |
| **Double Damage** | `score > 45` | Show `#modifier-double-damage` (label text displays `DVPLICEM`). |

#### Tempus Timer Implementation
- Calculate duration: `let duration = Math.max(8, 12 - (score - 16) * 0.12);`
- Use a 100ms interval timer for smooth UI update of `#timer-bar` width and `#timer-countdown` text (e.g. `11.4s`).
- On timer expiration, trigger the timeout damage loop.

#### Caecus Masking Implementation
- When generating the display text for `#latin-word`:
  - If `score > 30`, replace characters at odd indices with `_` (e.g., `lupus` -> `l_p_s`).
  - Otherwise, display the full word.

### Ability Buttons State Binding
Enable/Disable abilities depending on current `favor` and status:
- **Scutum**: Enable if `favor >= 40` AND `!scutumActive`. Cost: 40% favor.
- **Oracolo**: Enable if `favor >= 30`. Cost: 30% favor. Reveal target translation or direct clue in `#clue-display`.
- **Gladius**: Enable if `favor >= 60`. Cost: 60% favor. Instantly defeats word (score +2, wordsDefeated +1, play `gladius` sound, trigger slash flash, load new word).

### General UI Elements Sync
- Update progress bar widths (`#player-hp-bar`, `#enemy-hp-bar`, `#crowd-favor-bar`).
- Set `aria-valuenow`, `aria-valuetext` values on progress bars.
- Clear `#input-answer` and call `.focus()` on it when serving a new word.

---

## 5. Web Audio API Integration

The audio synthesizer (`js/sound.js`) must conform to the browser security guidelines for interactive initialization.

- **Initialization**: Instantiate `RomanArenaAudio` object. Upon first user click anywhere (or `#btn-start` click), invoke `audio.init()` to resume the context.
- **State tracking**: Set the custom `data-audio-state` attribute on the `<body>` element to `"running"`, `"suspended"`, or `"error"` (if initialization throws an exception).
- **Sound Events**: Whenever a sound effect plays, set `data-audio-last-played` attribute on `<body>` to:
  - `"correct"` (standard correct answer)
  - `"incorrect"` (wrong answer / timeout)
  - `"shield"` (Scutum block)
  - `"gladius"` (Gladius ability)
  - `"cheer"` (5-streak or enemy defeat)

---

## 6. Implementation Checklist & Integrity Precautions

1. **Vocabulary Consistency**: Ensure that `js/vocab.js` contains a database of at least 100 words including the exact ones checked in `tests/gladiator.test.js` (e.g. `lupus`, `pater`, `esse`, `humanitas`) to avoid test failures.
2. **Double Click Prevention**: Disable the strike button or set a short lockout flag in the submit handler to prevent multiple rapid evaluations of a single word.
3. **Audio Exception Handling**: Wrap the `AudioContext` class creation in a `try-catch` block. If it fails, log the error and set `data-audio-state="error"` without breaking the gameplay flow.
