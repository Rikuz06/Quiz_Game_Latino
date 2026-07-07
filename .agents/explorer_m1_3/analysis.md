# Milestone M1 Analysis: Responsiveness, Accessibility, and JavaScript Integration Bindings

This report outlines the layout system, DOM selectors, class configurations, and accessibility best practices for the Gladiator Arena Vocabulary Trainer. 

---

## 1. Symmetrical, Centered, and Responsive Arena Layout

To achieve an immersive Roman Arena experience, the layout must be symmetrical, centered, and fully responsive across mobile, tablet, and desktop screens. We propose using a combination of Flexbox for overall centering and state containers, and CSS Grid for the Battle Screen.

### Viewport Centering & Root Container
The main wrapper occupies `100vh` and uses Flexbox to center the game board vertically and horizontally. This ensures the app is never offset or pushed down.

```css
:root {
  --color-imperial-purple: #800020;
  --color-crimson: #990000;
  --color-gold: #d4af37;
  --color-gold-hover: #f3e5ab;
  --color-marble-light: #f5f2eb;
  --color-marble-dark: #2d2626;
  --max-game-width: 1200px;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-marble-dark);
  font-family: 'Serif', Georgia, serif;
}

.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Base screen settings */
.screen {
  width: 100%;
  max-width: var(--max-game-width);
  margin: 0 auto;
  display: none; /* Controlled by JavaScript state switching */
  box-sizing: border-box;
}

.screen.active {
  display: flex;
}
```

### Screen-Specific Layouts
1. **Start Screen & Game Over Screen**:
   - Use a simple centered vertical flex layout.
   - Symmetrical gold borders, title block using Google Fonts "Cinzel", and clean spacing.
   ```css
   #start-screen, #game-over-screen {
     flex-direction: column;
     align-items: center;
     justify-content: center;
     text-align: center;
     border: 4px double var(--color-gold);
     padding: 40px;
     background-color: var(--color-marble-light);
     border-radius: 12px;
     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
   }
   ```

2. **Battle Screen (Responsive Grid)**:
   To enforce a symmetrical gladiator face-off, the desktop view uses a three-column layout.
   - **Left Column**: Player Panel (avatar, HP, Crowd Favor, abilities).
   - **Center Column**: Arena Core (countdown timer, active word card, translation input, action triggers).
   - **Right Column**: Enemy Panel (avatar, HP, active modifiers).

   ```css
   #battle-screen.active {
     display: grid;
     grid-template-columns: 1fr 1.5fr 1fr;
     gap: 30px;
     align-items: stretch;
     width: 100%;
   }
   
   .player-panel, .enemy-panel {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: flex-start;
     background-color: var(--color-marble-light);
     border: 3px double var(--color-gold);
     border-radius: 8px;
     padding: 20px;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
   }

   .arena-core {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: space-between;
     padding: 10px;
   }
   ```

### Responsiveness & Breakpoints
To adapt to varying screen widths while maintaining visual balance:

- **Tablet/Medium Screens (max-width: 1024px)**:
  - Transition the grid to a two-row format.
  - Row 1: Player Panel and Enemy Panel placed side-by-side (`grid-template-columns: 1fr 1fr`).
  - Row 2: Arena Core spanning the full width beneath them. This preserves the left-right gladiator symmetry.
  ```css
  @media (max-width: 1024px) {
    #battle-screen.active {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "player enemy"
        "arena arena";
      gap: 20px;
    }
    .player-panel { grid-area: player; }
    .enemy-panel { grid-area: enemy; }
    .arena-core { grid-area: arena; margin-top: 15px; }
  }
  ```

- **Mobile/Small Screens (max-width: 768px)**:
  - Transition to a vertical flex layout.
  - Stack the panels vertically, placing the crucial visual targets in order:
    1. **Enemy Panel** (Top): Shows the opponent's name, HP, and modifiers (so the player knows who they are attacking).
    2. **Arena Core** (Center): Vocabulary card and input field. Keeps the text input easily clickable and visible above virtual keyboards.
    3. **Player Panel** (Bottom): Shows Player HP, Favor, and special ability buttons for quick thumb reach.
  ```css
  @media (max-width: 768px) {
    #battle-screen.active {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .enemy-panel { order: 1; }
    .arena-core { order: 2; }
    .player-panel { order: 3; }
  }
  ```

---

## 2. JavaScript Integration Bindings: DOM Selectors & State Classes

To bind the HTML static structure with `app.js`, `vocab.js`, and `sound.js`, we define the following unique DOM IDs, structural classes, and data-attributes:

### Screen State Management
- `#start-screen`: The welcome/start screen container.
- `#battle-screen`: The active battle container.
- `#game-over-screen`: The game-over results container.
- `.screen`: Base class for screen wrappers.
- `.hidden` / `.active`: Utility classes for state transitions.
  - In CSS: `.hidden { display: none !important; }`
  - In JS: `screenElement.classList.add('hidden')` or `screenElement.classList.toggle('active')`

### Action Controls
- `#start-btn`: Start button on Start Screen. Click handler initializes audio and triggers gameplay.
- `#restart-btn`: Play Again button on Game Over Screen. Resets stats and state.
- `#answer-input`: Text field for typing the translation. Listen to `keydown` event for "Enter" submissions.
- `#submit-btn`: Programmatic button wrapper for verification tests.

### Score & Progress Tracking
- `#player-score`: Element displaying current score.
- `#player-level`: Element displaying current level (1-5).
- `#player-hp-bar`: Progress bar wrapper for Player HP.
- `#player-hp-text`: Numeric label inside the HP bar (e.g., "100 / 100").
- `#player-favor-bar`: Progress bar wrapper for Crowd Favor.
- `#player-favor-text`: Numeric label inside the Favor bar (e.g., "40%").
- `#enemy-name`: Opponent gladiator's name text.
- `#enemy-hp-bar`: Progress bar wrapper for current word/enemy HP.
- `#enemy-hp-text`: Numeric label for enemy HP.

### Game Modifiers Indicators
Active modifiers should be shown as visible badges in the Enemy Panel:
- `#modifier-tempus`: Indicator for countdown speed escalation.
- `#modifier-caecus`: Indicator for hidden letters.
- `#modifier-double`: Indicator for doubled failure damage.
- Class `.modifier-active`: Highlights active badges.

### Vocabulary Card & Timer
- `#vocab-card`: Card element displaying the current Latin query.
- `#latin-word`: Text element for the active Latin word (e.g. `lupus`).
- `#timer-container`: Visual wrapper for countdown timer.
- `#timer-bar`: Shinking fill element representing remaining time.
- `#timer-text`: Precise countdown text display (e.g., `8.2s`).

### Crowd Favor Abilities (Player Panel)
Buttons for triggering special actions.
- `#ability-scutum`: Shield ability (costs 40%).
- `#ability-oracolo`: Hint ability (costs 30%).
- `#ability-gladius`: Instant defeat ability (costs 60%).
- Class `.ability-btn`: Base class for ability triggers.
- State Classes:
  - `.locked`: Added when Crowd Favor is insufficient. Visual styling: grayscale, low opacity, `cursor: not-allowed`.
  - `.unlocked`: Added when Favor meets cost. Visual styling: glowing border, hover animation.
  - `.active-shield`: Added to the player container when Scutum absorbs the next hit.

### Interactive Animations Hook Points
- `body` or `#battle-screen`: Targets for CSS shake & hit flash animations.
  - `.shake-damage`: Temporarily applied via JS on damage to trigger screen vibration.
  - `.flash-hit`: Temporarily applied via JS on correct answer to flash screen white/gold.
- `#particle-container`: Absolute overlay inside the Arena Core to spawn temporary particle spans on successful answers.

---

## 3. Accessibility (A11y) & Interactive UI Feedback

To comply with high-school student accessibility needs, visual-only status changes are prohibited. Focus states and ARIA mappings must be integrated from Milestone 1.

### Focus States & Outline Styles
- **Input Focus**: `#answer-input` must have a prominent outline to indicate write readiness.
  ```css
  #answer-input:focus {
    outline: 3px solid var(--color-gold);
    outline-offset: 2px;
    box-shadow: 0 0 10px var(--color-gold);
  }
  ```
- **Keyboard Navigation Focus**: Use the `:focus-visible` pseudo-class for buttons (`.ability-btn`, `#start-btn`, `#restart-btn`). This keeps mouse interaction clean while showing a bold imperial gold outline to keyboard-navigating users.
  ```css
  .ability-btn:focus-visible, 
  #start-btn:focus-visible, 
  #restart-btn:focus-visible {
    outline: 3px solid var(--color-gold);
    outline-offset: 4px;
  }
  ```
- **Focus Preservation**:
  - The game loop should proactively call `document.getElementById('answer-input').focus()` on new word loaded, and immediately after screen transition to the Battle Screen.
  - Tabbing through active abilities must be supported. Once an ability is activated via keyboard, focus should ideally return to `#answer-input`.

### Keyboard Shortcuts
To avoid forcing mouse movements during rapid-fire typing:
- **Shortcut Design**: Use number keys `1`, `2`, and `3` to trigger special abilities:
  - `1`: Activate *Scutum* (Shield)
  - `2`: Activate *Oracolo* (Reveal Clue)
  - `3`: Activate *Gladius* (Instant Defeat)
- **Shortcut Mapping Context**:
  - Since translation answers contain letters (Italian vocabularies do not contain digits), typing numbers `1`, `2`, or `3` inside `#answer-input` will not conflict with valid input text.
  - The document `keydown` event listener will capture `event.key === '1'`, `event.key === '2'`, and `event.key === '3'`, prevent default input writing if necessary, check if the player has sufficient Crowd Favor, and execute the ability.
  - **Visual Shortcut Indicators**: Visual text labels (e.g. `[1]`, `[2]`, `[3]` or small key-cap badges) must be placed inside or adjacent to the ability buttons to indicate the shortcut keys clearly to the user.

### ARIA Roles and Live Regions
To make the page accessible to screen-reader users, we define the following ARIA bindings:

1. **Active Screen Hiding**:
   - Apply `aria-hidden="true"` to inactive screen containers (`#start-screen`, `#game-over-screen`) when the battle is active. Set `aria-hidden="false"` on the active screen.
   - Screen-reader focus should be programmatically locked to the active screen modal container.

2. **HP and Crowd Favor Gauges**:
   - Since custom styled divs are used instead of native HTML `<progress>` elements, apply `role="progressbar"` with accompanying metrics.
   - Example markup bindings:
     ```html
     <!-- Player HP progress bar -->
     <div id="player-hp-progress" 
          role="progressbar" 
          aria-valuemin="0" 
          aria-valuemax="100" 
          aria-valuenow="100" 
          aria-label="Punti Vita del Giocatore"
          aria-valuetext="100 percento di salute">
          <!-- Inner fill -->
          <div id="player-hp-bar" class="progress-bar-fill"></div>
     </div>
     ```

3. **Screen Reader Announcements (Live Regions)**:
   - Make the active word element a live region:
     ```html
     <div id="vocab-card" aria-live="polite">
       <span id="latin-word">lupus</span>
     </div>
     ```
     This forces the screen reader to announce the new Latin word immediately when changed in JS.
   - Make the feedback message element assertive:
     ```html
     <div id="feedback-message" aria-live="assertive" aria-atomic="true"></div>
     ```
     When JS sets content here (e.g., "Corretto! +10 Punti", "Errato! Danno subito"), it is announced immediately, interrupting other text.

4. **Ability Button Descriptions & States**:
   - Map tooltips to buttons via `aria-describedby`:
     ```html
     <button id="ability-scutum" class="ability-btn locked" data-cost="40" aria-describedby="scutum-desc">
       Scutum <span class="kbd-badge">[1]</span>
     </button>
     <span id="scutum-desc" class="sr-only">Assorbe il danno del prossimo errore. Richiede 40% Favore della Folla. Scorciatoia: Tasto 1.</span>
     ```
   - When Crowd Favor is insufficient, add `aria-disabled="true"` to the ability buttons instead of `disabled`. This allows keyboard users to focus the button and read its description/cost/hotkey, but JS will ignore clicks and keyboard activation commands while the state is true.

5. **Motion Sensitivity Options (A11y)**:
   - Respect users who have set systems to prefer reduced motion by disabling animations, flashes, and shakes.
     ```css
     @media (prefers-reduced-motion: reduce) {
       .shake-damage {
         animation: none !important;
       }
       .flash-hit {
         animation: none !important;
       }
       .particle {
         display: none !important;
       }
     }
     ```
   - Add a global visual toggler button (`#toggle-accessibility-motion`) in the settings/start-screen to toggle a `.reduced-motion` class on the `<body>` element, allowing users to manually disable these screen effects.
