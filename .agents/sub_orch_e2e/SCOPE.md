# Scope: E2E Testing Track

## Architecture
The E2E testing track establishes the test environment using Jest and Puppeteer. It runs against `index.html` (the SPA frontend) inside a headless Chromium instance.

- **Test Framework**: Jest (v29+)
- **Browser Automation**: Puppeteer (v20+)
- **Test Runner Config**: `jest-puppeteer` preset or custom Jest integration.
- **Test Files Location**: `/tests/` directory.

## Milestones
| # | Name | Scope | Dependencies | Status | Conv ID |
|---|------|-------|-------------|--------|---------|
| 1 | Test Strategy & Requirements | Design test strategy and define 71 test cases in TEST_INFRA.md | None | DONE | 155d401f-13a7-410d-948c-6805163026be |
| 2 | Test Runner Configuration | Initialize package.json, jest.config.js, and install dependencies | M1 | DONE | 0b66d5c2-85d5-47d2-9fce-ee2246b39830 |
| 3 | E2E Test Suite Implementation | Write the 71 E2E test cases in `tests/gladiator.test.js` using modular helpers | M2 | PLANNED | TBD |
| 4 | Verification & Readiness | Verify test syntax, compile, run test runner smoke check, publish TEST_READY.md | M3 | PLANNED | TBD |

## Interface Contracts
- **Audio Verification**: The page must write `data-audio-state` and `data-audio-last-played` attributes on `<body>`.
- **UI Element Selectors**: Standard CSS IDs (`#start-screen`, `#btn-start`, `#input-answer`, etc.) as defined in `TEST_INFRA.md`.
