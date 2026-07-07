## 2026-07-07T08:13:08Z

You are the Test Infrastructure Architect.
Your task is to write c:\Users\rpalu\Desktop\Quiz-latino-fracco\TEST_INFRA.md.
This file must lay out the test strategy, run setups, and write the required test cases covering Tiers 1-4.
The vocabulary trainer has the following 6 features (N=6):
1. Game State Management (Start, Battle, Game Over, Restart)
2. Combat & HP Loop (Correct/incorrect answer damage, score tracking, player death)
3. Dynamic Difficulty Escalation (Score thresholds for Levels 1-5)
4. Active Modifiers (Tempus timer, Caecus hidden letters, Double Damage)
5. Crowd Favor & Special Abilities (Streak tracking, Scutum, Oracolo, Gladius abilities)
6. Web Audio API (Web Audio context initialization and event triggers)

You must define exactly 71 test cases:
- Tier 1: 30 cases (5 per feature, happy-path)
- Tier 2: 30 cases (5 per feature, boundary/error cases)
- Tier 3: 6 cases (pairwise combinations)
- Tier 4: 5 cases (real-world application-level workloads)

Your working directory for metadata is c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_test_infra\. Please initialize your progress.md and briefing.md files there.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.
Write the c:\Users\rpalu\Desktop\Quiz-latino-fracco\TEST_INFRA.md file in the project root containing:
- Test Philosophy (opaque-box, requirement-driven)
- Feature Inventory (6 features with Tier details)
- Test Architecture (Puppeteer/Jest setup, how runner will invoke tests, selectors contract)
- Complete list of the 71 test cases (Tiers 1-4) with clear description, inputs, and expected outcomes.
- Run setup instructions

When done, write c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_test_infra\handoff.md and notify the sub-orchestrator.
