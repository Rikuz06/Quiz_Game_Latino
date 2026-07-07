# E2E Test Suite Implementation Plan

## Objective
Establish the Puppeteer/Jest E2E test runner, design and write a comprehensive, requirement-driven, opaque-box E2E test suite covering Tiers 1-4 for the Gladiator Arena vocabulary trainer.

## Plan Steps
1. **Analyze Requirements and Setup Test Strategy**:
   - Define features (N=6):
     - F1: Screen Navigation & State Transitions (Start Screen, Battle, Game Over, Restart)
     - F2: Combat & HP Mechanics (Correct/incorrect answer damage, score, game over)
     - F3: Dynamic Difficulty Escalation (Levels 1-5 transitions based on score)
     - F4: Active Modifiers (Tempus, Caecus, Double Damage at score thresholds)
     - F5: Crowd Favor & Abilities (Favor accumulation, Scutum, Oracolo, Gladius)
     - F6: Web Audio API (Context initiation, audio event triggers)
   - Minimum required test cases:
     - Tier 1: 5 * 6 = 30 cases
     - Tier 2: 5 * 6 = 30 cases
     - Tier 3: 6 cases
     - Tier 4: 5 cases
     - Total: 71 cases.
   - Dispatch an Explorer or Worker to write `TEST_INFRA.md` detailing the test cases, setup, and philosophy.

2. **Establish E2E Test Runner Configuration**:
   - Write `package.json` (add Jest, Puppeteer, Jest-Puppeteer, Babel/ES6 support if needed).
   - Write `jest.config.js` or `jest-puppeteer.config.js`.
   - Dispatch a Worker to initialize npm, install dependencies, and set up configuration files.

3. **Implement E2E Test Suite (Tiers 1-4)**:
   - Create a test folder `tests/` and test file(s) (e.g., `tests/gladiator.test.js`).
   - Implement all 71+ test cases simulating client actions using Puppeteer (e.g., loading `index.html`, clicking start, entering translations, checking DOM elements, mock timer tick/wait, triggering abilities).
   - Since the product code is not yet written (M1-M5 are PLANNED), the E2E tests should be robustly structured and reference clean DOM selectors (e.g. `[data-testid="..."]` or standard IDs like `#start-btn`, `#hp-display`, etc.) which will be documented in `TEST_INFRA.md` as contracts for the Implementation Track.

4. **Verify E2E Setup & Test Output Layout**:
   - Verify the package.json, configs, and test files are correctly placed.
   - Run the tests (they should fail gracefully or check if they run, or we can check compile/syntax since HTML/JS is not fully implemented, or we can set up a dummy page to verify Puppeteer integration, or verify the test suite structure).
   - Note: Since we are in the E2E Testing Track, our goal is to publish the test suite so the implementation track can work against it. However, we should make sure the test environment compiles/runs (e.g., running jest syntax checks or a smoke test).

5. **Generate TEST_READY.md and Handoff**:
   - Write `TEST_READY.md` containing the list of test cases, categories, commands to run, and coverage details.
   - Send completion message to parent.
