# M1 Review & Challenge Report — Index.html & Styles.css

## Review Summary

**Verdict**: REQUEST_CHANGES

This review assessed the HTML structure and CSS styling in `index.html` and `styles.css` at the project root for selector conformance, visual theme compliance, typography, layout symmetry, and mobile robustness. 

Several major findings prevent approval:
1. **Undefined custom properties in CSS**: The core font color for `.cinzel-title` relies on `--color-gold-roman`, which is never defined in `:root`.
2. **Missing CSS class definitions**: The class `.gold-border` is used heavily throughout `index.html` (specifically for borders on rules, buttons, and stat blocks) but is never defined in `styles.css`. This causes elements like `.stat-block` to completely lack their borders, breaking the visual layout.
3. **Asymmetric corner decoration**: Symmetrical gold corner trims only cover 2 out of 4 corners (top-left and bottom-right).

---

## Findings

### [Major] Undefined custom CSS property `--color-gold-roman`
- **What**: The header titles style `.cinzel-title` references an undefined custom property `var(--color-gold-roman)`.
- **Where**: `styles.css`, line 140:
  ```css
  color: var(--color-gold-roman);
  ```
- **Why**: Since `--color-gold-roman` is not defined in the `:root` block of `styles.css`, the color property fails to resolve to gold. This leaves the titles in their fallback colors, violating the "crimson, gold border trims, and marble slab panels" visual guidelines.
- **Suggestion**: Define `--color-gold-roman` in `:root` (e.g. `--color-gold-roman: #d4af37;`) or change line 140 to use the existing defined variable `--color-gold`.

### [Major] Missing `.gold-border` CSS class definition
- **What**: The CSS class `gold-border` is used in `index.html` on multiple elements but has no definition in `styles.css`.
- **Where**: `index.html` (lines 36, 57, 62, 251, 255, 260, 265, 272), `styles.css` (entire file).
- **Why**: Since `.gold-border` has no CSS definition, it does not apply any border styling. While buttons (`.roman-btn`) and the rules panel (`.rules-container`) have borders explicitly defined in their other classes, the `.stat-block` elements (lines 255, 260, 265) do not. Thus, the three final statistics blocks on the Game Over screen completely lack borders, breaking the symmetrical gold borders theme.
- **Suggestion**: Add a `.gold-border` class definition in `styles.css`:
  ```css
  .gold-border {
    border: 2px solid var(--color-gold) !important;
  }
  ```

### [Minor] Missing `.Lora-text` CSS class definition
- **What**: The class `Lora-text` is applied in `index.html` but is not defined in `styles.css`.
- **Where**: `index.html`, line 30:
  ```html
  <div class="game-description Lora-text">
  ```
- **Why**: This class is referenced but has no styles attached in `styles.css`. The font family falls back to Lora via `body` inheritance, but referencing a non-existent class is a code quality issue.
- **Suggestion**: Define `.Lora-text` in `styles.css` or remove the class from `index.html`.

### [Minor] Asymmetrical gold corner trims (Only 2 corners decorated)
- **What**: Symmetrical gold corner trims only decorate the top-left and bottom-right corners of `.roman-frame` panels.
- **Where**: `styles.css`, lines 97-116.
- **Why**: The `::before` pseudo-element targets `top: -8px; left: -8px;` and `::after` targets `bottom: -8px; right: -8px;`. The other two corners (top-right and bottom-left) have no gold trims. This violates the expectation of symmetrical visual trims on rectangular panels.
- **Suggestion**: Create full corner trims using box-shadow tricks or by adding an inner layout wrapper to allow the usage of additional pseudo-elements or background border-images.

---

## Verified Claims

- **Selectors Contract Conformance** → verified via manual element inspection of `index.html` against `TEST_INFRA.md` → **PASS**
  - All 27 required selectors listed in `TEST_INFRA.md` are present on the correct element types.
- **Typography - Google Fonts Integration** → verified via stylesheet checks → **PASS**
  - Google Fonts links for `Cinzel` and `Lora` are present in `<head>`, and CSS fallback properties resolve to `Georgia` and `Times New Roman`.
- **Mobile Compatibility - Form Wrapper** → verified via structural inspection of `index.html` → **PASS**
  - The `#input-answer` element is properly wrapped inside `<form id="answer-form">` with `#btn-submit` set as `type="submit"`, enabling virtual keyboard action compatibility.

---

## Coverage Gaps

- **Procedural sound and animations** — risk level: Low — recommendation: Accept risk (these features are designated for Milestones M2-M6 and do not affect the static layout review).

---

## Unverified Items

- **Visual Rendering of Colors and Layouts** — Reason not verified: Puppeteer and Chrome tests are not yet set up for milestone M1. Visual layout rendering was verified via code inspection.

---

## Challenge Summary

**Overall risk assessment**: MEDIUM

While the layout structure is sound, the responsive design on mobile screens presents a gameplay challenge.

---

## Challenges

### [Medium] Virtual Keyboard Occlusion of Active Modifiers & Abilities on Mobile
- **Assumption challenged**: The layout is fully compatible with mobile virtual keyboards.
- **Attack scenario**: When a player focuses `#input-answer` on a mobile device, the virtual keyboard slides up. The current CSS media query for mobile (`max-width: 768px`) stacks the columns as:
  1. Enemy Side (`order: 1`)
  2. Arena Core (`order: 2` containing the input form)
  3. Player Side (`order: 3` containing active abilities and the Crowd Favor bar)
  Because the input form is in the middle and the keyboard occupies the bottom, the Player Side is completely pushed off-screen. The player cannot see their Crowd Favor bar or manually trigger Scutum/Oracolo/Gladius. Furthermore, hotkeys (`1`, `2`, `3`) will type numbers into the translation input rather than triggering abilities when focused.
- **Blast radius**: Gameplay difficulty. Players under timer constraints cannot activate abilities without scrolling up and down, disrupting the game.
- **Mitigation**: Move the Crowd Favor bar and ability triggers into the static top HUD or implement a floating bar that sits above the virtual keyboard.

### [Low] Absence of Start/Restart Rapid Click Mitigation
- **Assumption challenged**: Rapidly clicking Start/Restart will not break the game state.
- **Attack scenario**: A user double-clicking `#btn-start` or `#btn-restart` could trigger duplicate initialization code if not throttled.
- **Blast radius**: Low.
- **Mitigation**: Ensure buttons have standard disabled styling when clicked, and the JS script enforces a loading state.
