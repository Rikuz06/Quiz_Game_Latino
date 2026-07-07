## 2026-07-07T10:14:41Z
You are the Test Runner Configurer.
Your task is to establish the test runner environment for the E2E tests.
1. Create a `package.json` at the project root (c:\Users\rpalu\Desktop\Quiz-latino-fracco\package.json) with:
   - `"scripts": { "test": "jest" }`
   - DevDependencies: `jest`, `puppeteer`. (Wait, let's keep it simple: we can use just `jest` and `puppeteer` directly in the test files by launching browser manually in `beforeAll` and closing it in `afterAll`, which is often more reliable than `jest-puppeteer` wrapper, or you can use `jest-puppeteer`. Let's install `jest` and `puppeteer`).
2. Run `npm install` (via run_command) to install the dependencies in the workspace.
3. Write `jest.config.js` at the project root with configuration to match `tests/**/*.test.js`.
4. Verify the setup compiles and jest can be invoked (even if there are no tests yet, or you can create a dummy test first to verify it runs).

Your working directory for metadata is c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_config_setup\. Initialize your progress.md and briefing.md files there.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.

When done, write c:\Users\rpalu\Desktop\Quiz-latino-fracco\.agents\worker_config_setup\handoff.md and notify the sub-orchestrator.
