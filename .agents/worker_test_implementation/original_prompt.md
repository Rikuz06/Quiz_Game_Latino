## 2026-07-07T08:17:43Z
You are the E2E Test Implementer.
Your task is to write c:\Users\rpalu\Desktop\Quiz-latino-fracco\tests\gladiator.test.js containing the complete automated test suite of 71 test cases covering Tiers 1-4 for the Gladiator Arena Vocabulary Trainer.
The test suite must load the application index.html using Puppeteer (using file:// URL format) and execute the test cases.

Here is the required structure of the test suite in `tests/gladiator.test.js`:
1. Use standard Puppeteer setup:
   - `beforeAll` to launch the browser.
   - `afterAll` to close the browser.
   - `beforeEach` to load `index.html` and reset state.
2. Define a local dictionary of the Latin-to-Italian vocabulary pairs (e.g., lupus -> lupo, pater -> padre, etc., matching the 100+ words).
3. Implement helper functions for clean tests:
   - `async function getWord(page)`: reads `#latin-word`.
   - `async function solveActiveWord(page, correct = true)`:
     - reads the word in `#latin-word`.
     - handles Caecus masking (e.g., if the word is "l_p_s", it matches the regex /l.p.s/ against the local dictionary keys to find "lupus", retrieves its translation "lupo").
     - types the translation (or an incorrect one if `correct = false`) in `#input-answer`.
     - clicks `#btn-submit` (or presses Enter).
   - `async function triggerAbility(page, abilityName)`: clicks the corresponding button or presses the hotkey (e.g. key "1"/"S" for Scutum, "2"/"O" for Oracolo, "3"/"G" for Gladius).
   - `async function getHP(page)`: parses `#player-hp` text.
   - `async function getEnemyHP(page)`: parses `#enemy-hp` text.
   - `async function getScore(page)`: parses `#player-score` text.
   - `async function getStreak(page)`: parses `#player-streak` text.
   - `async function getLevel(page)`: parses `#level-display` text.
   - `async function getAudioState(page)`: reads body attribute `data-audio-state`.
   - `async function getAudioLastPlayed(page)`: reads body attribute `data-audio-last-played`.

4. Write all 71 test cases grouped by Tier and Feature:
   - Tier 1: 30 cases (5 per feature, TC-1.1.1 to TC-1.6.5)
   - Tier 2: 30 cases (5 per feature, TC-2.1.1 to TC-2.6.5)
   - Tier 3: 6 cases (Pairwise combinations, TC-3.1 to TC-3.6)
   - Tier 4: 5 cases (Real-world workloads, TC-4.1 to TC-4.5)

Ensure all 71 test cases are explicitly coded with assertions using Jest expect.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.

Your working directory for metadata is c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_test_implementation\. Initialize your progress.md and briefing.md files there.
When done, write c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_test_implementation\handoff.md and notify the sub-orchestrator.
