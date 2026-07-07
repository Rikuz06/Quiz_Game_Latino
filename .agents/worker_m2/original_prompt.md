## 2026-07-07T08:26:01Z
You are Worker 3 for Milestone M2 (Core Gameplay Loop).
Your working directory is c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_m2\.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task is to implement the core gameplay loop, vocabulary database, and audio stubs.
Specifically:
1. Create `js/vocab.js` containing the 103 aligned Latin-Italian vocabulary pairs across 5 difficulty levels exactly as designed by Explorer 1 and 3 (with spelling overrides for level 5 words 'existenta' and 'transendentia'). Implement and export `getWordByLevel(level)` as an ES6 module function.
2. Create `js/sound.js` containing the `RomanArenaAudio` class/namespace with methods: `init()`, `playCorrect()`, `playIncorrect()`, `playShield()`, `playGladius()`, and `playCheer()`. It must conform to the Headless Web Audio Verification Contract in `TEST_INFRA.md` by managing the `data-audio-state` and `data-audio-last-played` attributes on the `<body>` element.
3. Create `js/app.js` containing the core game engine and state machine:
   - Handle transitions between #start-screen, #battle-screen, and #game-over-screen.
   - Track player HP (starts at 100), player score, player streak, enemy HP, active level, and Crowd Favor.
   - Implement answer checking (case-insensitive, trimmed whitespace, blank input is incorrect). Correct answers deal damage to the enemy (and load a new word). Incorrect answers or timeouts deal damage to the player and reset correct streak.
   - Update all DOM elements (#player-hp, #player-score, #player-streak, #level-display, #enemy-hp, #crowd-favor-bar, etc.) dynamically. Be sure to update the visual bar elements (e.g. style.width on .player-hp-fill inside #player-hp-bar, and text content for #player-favor-text inside #crowd-favor-bar).
   - Implement keyboard hotkeys (1/S, 2/O, 3/G) but bypass them if #input-answer is focused.
   - Transition to #game-over-screen when player HP reaches 0 and display final stats (#stats-words-defeated, #stats-max-streak, #stats-final-score).
   - Wire #btn-start, #btn-submit, and #btn-restart. Ensure rapid starts/restarts are de-duplicated and prevent multiple intervals from running.

Verify your work:
- Run `npm install` to install dependencies.
- Run the test suite via `npm test` or a targeted test execution.
- Note any failing tests (since modifiers and full ability mechanics are designated for subsequent milestones).

Write your handoff report to `c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_m2\handoff.md` summarizing the changes, files created, and test results, and notify the orchestrator (conversation ID 8b7d427d-c0f7-4f15-bac8-c348a3846499) via send_message.
