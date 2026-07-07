# Gladiator Arena Layout Structure & Design Recommendation

This document outlines the proposed semantic HTML layout and CSS design structure for the **Gladiator Arena Latin Vocabulary Trainer**. It provides a solid architectural blueprint for Milestone M1 (Static UI & Styling).

---

## 1. Architectural Strategy & Design System

To capture the **Ancient Roman Gladiator Arena** theme while maintaining code cleanlines and performance, we adopt a Single Page Application (SPA) structure. Screens are toggled using simple class transitions (`.hidden`).

### Color Palette (CSS Variables)
```css
:root {
  --color-imperial-purple: #800020;  /* Main theme, buttons, headers */
  --color-crimson: #a91b0d;          /* Damage, enemy panels, alert states */
  --color-gold: #d4af37;             /* Borders, active items, score highlights */
  --color-gold-light: #f5e4a3;       /* Accents and text details */
  --color-marble-white: #f7f5f0;     /* Panel background */
  --color-marble-shadow: #e3dec9;    /* Marble grain & shadows */
  --color-text-dark: #221c17;        /* Readable serif text */
  --color-text-light: #ffffff;       /* Overlay text */
  
  --font-headers: 'Cinzel', serif;    /* Stone engraving look */
  --font-body: 'Lora', Georgia, serif; /* High readability for vocabulary */
}
```

---

## 2. Global Document Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gladiator Arena - Latin Vocabulary Trainer</title>
  <!-- Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="roman-theme">
  
  <!-- Canvas layer for high-performance canvas particle effects (e.g. correct answer sparkles) -->
  <canvas id="effects-canvas" class="effects-overlay"></canvas>

  <main id="arena-container" class="arena-container">
    <!-- Screens injected/toggled here -->
  </main>

  <!-- Audio Context Initializer Overlay (Browser Security Policy Compliance) -->
  <div id="audio-init-banner" class="audio-banner">
    <span>🔊 Clicca ovunque per abilitare l'audio dell'arena!</span>
  </div>

  <script src="js/vocab.js" type="module"></script>
  <script src="js/sound.js" type="module"></script>
  <script src="js/app.js" type="module"></script>
</body>
</html>
```

---

## 3. Detailed Screen Layouts

### Screen 1: Start Screen (`#start-screen`)
Designed as a large monumental marble slab in the center of the viewport, presenting the main title, rules, and entry button.

```html
<section id="start-screen" class="screen active">
  <div class="marble-panel centered-panel text-center">
    
    <header class="arena-header">
      <h1 class="cinzel-title">GLADIATOR ARENA</h1>
      <p class="cinzel-subtitle">LVDVS VERBORVM LATINORVM</p>
    </header>

    <div class="game-description">
      <p class="intro-text">
        Benvenuto, Recluta! Step into the imperial arena. Translate Latin terms correctly to strike down opposing gladiators. 
        Fail or run out of time, and the enemy will strike back.
      </p>

      <!-- Symmetrical Rules and Difficulty Grid -->
      <div class="rules-container gold-border">
        <h3 class="section-title">Difficulty Levels</h3>
        <ul class="difficulty-list">
          <li><strong>Level 1 (0-5 pts):</strong> Basic Nouns (e.g., <em>lupus, pater</em>)</li>
          <li><strong>Level 2 (6-15 pts):</strong> Common Verbs & Adjectives</li>
          <li><strong>Level 3 (16-30 pts):</strong> Complex 3rd Declension Words</li>
          <li><strong>Level 4 (31-50 pts):</strong> Abstract Nouns & Irregular Verbs</li>
          <li><strong>Level 5 (51+ pts):</strong> Philosophical Concepts</li>
        </ul>
        <div class="modifiers-disclaimer">
          <p>⚠️ <strong>Active Modifiers:</strong></p>
          <p>Score &gt; 15: <strong>Tempus</strong> (Speed round: 12s down to 8s timer)</p>
          <p>Score &gt; 30: <strong>Caecus</strong> (Partially hidden letters in word cards)</p>
          <p>Score &gt; 45: <strong>Duplicem</strong> (Double damage on wrong translations)</p>
        </div>
      </div>
    </div>

    <button id="start-btn" class="roman-btn gold-border cinzel-title">ENTER ARENA</button>
  </div>
</section>
```

---

### Screen 2: Battle Screen (`#battle-screen`)
A grid-based, symmetrical control center. Displays the player's health/status, enemy info, the active word card, the user's text input, feedback animations, and the Crowd Favor abilities.

```html
<section id="battle-screen" class="screen hidden">
  
  <!-- 1. Top Status & HUD Bar -->
  <div class="hud-bar gold-border">
    <!-- Player HP Panel -->
    <div class="hud-item hp-hud">
      <span class="hud-label">VALITVDO (HP)</span>
      <div class="hud-progress-outer hp-bar-outer">
        <div id="player-hp" class="hud-progress-inner hp-bar-inner" style="width: 100%;"></div>
        <span id="player-hp-text" class="progress-text">100/100</span>
      </div>
    </div>

    <!-- Active Score -->
    <div class="hud-item score-hud">
      <span class="hud-label">GLORIA (SCORE)</span>
      <span id="game-score" class="hud-value gold-text">0</span>
    </div>

    <!-- Current Win Streak -->
    <div class="hud-item streak-hud">
      <span class="hud-label">SERIES (STREAK)</span>
      <span id="game-streak" class="hud-value gold-text">0</span>
    </div>

    <!-- Active Modifiers Box -->
    <div class="hud-item modifiers-hud">
      <span id="modifier-tempus" class="badge modifier-badge hidden" title="Time countdown active">TEMPUS</span>
      <span id="modifier-caecus" class="badge modifier-badge hidden" title="Letters are partially hidden">CAECUS</span>
      <span id="modifier-double" class="badge modifier-badge hidden" title="Double damage active">DVPLICEM</span>
    </div>
  </div>

  <!-- 2. Symmetrical Combat Grid -->
  <div class="combat-grid">
    
    <!-- Left Column: Enemy Gladiator Info -->
    <div class="marble-panel combat-panel enemy-side text-center">
      <h2 id="enemy-name" class="cinzel-title">PROVOCATOR</h2>
      
      <div class="enemy-avatar-container">
        <!-- Visual effects overlay specifically for slash attacks -->
        <div id="slash-flash" class="slash-flash-overlay"></div>
        <span class="enemy-avatar-icon">🛡️⚔️</span>
      </div>
      
      <div class="hud-progress-outer enemy-hp-bar-outer">
        <div id="enemy-hp" class="hud-progress-inner enemy-hp-inner" style="width: 100%;"></div>
        <span id="enemy-hp-text" class="progress-text">100/100</span>
      </div>
    </div>

    <!-- Right Column: Current Vocabulary & Interaction -->
    <div class="marble-panel combat-panel word-side text-center">
      <header class="card-header">
        <span id="word-level-badge" class="badge level-badge">LEVEL 1</span>
      </header>

      <!-- The Active Latin Word Card -->
      <div class="word-card">
        <div id="word-display" class="latin-word-display">LUPUS</div>
        <div id="word-clue" class="word-clue-box hidden"><em>Indizio: Mammifero canide...</em></div>
      </div>

      <!-- Action Panel & Answer Input -->
      <div class="action-box">
        <!-- Speed countdown timer (Tempus) -->
        <div id="timer-container" class="timer-container invisible">
          <div id="timer-bar" class="timer-progress-bar" style="width: 100%;"></div>
        </div>

        <form id="answer-form" class="answer-form">
          <input 
            type="text" 
            id="answer-input" 
            placeholder="Scrivi la traduzione..." 
            autocomplete="off" 
            required 
            autofocus
          >
          <button type="submit" id="strike-btn" class="roman-btn gold-border cinzel-title">STRIKE</button>
        </form>

        <div id="battle-feedback" class="battle-feedback"></div>
      </div>
    </div>

  </div>

  <!-- 3. Bottom Panel: Crowd Favor (Favor Populi) & Special Abilities -->
  <div class="marble-panel bottom-panel favor-panel text-center">
    <div class="favor-header">
      <span class="cinzel-subtitle">FAVOR POPVLI</span>
      <div class="hud-progress-outer favor-bar-outer">
        <div id="crowd-favor" class="hud-progress-inner favor-bar-inner" style="width: 0%;"></div>
        <span id="favor-text" class="progress-text">0%</span>
      </div>
    </div>

    <!-- Symmetrical Abilities Bar -->
    <div class="abilities-bar">
      <!-- Shield Ability -->
      <button id="ability-scutum" class="ability-card gold-border" disabled data-hotkey="1">
        <div class="ability-icon">🛡️</div>
        <div class="ability-info">
          <span class="ability-name">SCVTVM</span>
          <span class="ability-cost">Cost: 40%</span>
        </div>
        <div class="ability-hotkey">Tasto [1]</div>
      </button>

      <!-- Oracle Hint Ability -->
      <button id="ability-oracolo" class="ability-card gold-border" disabled data-hotkey="2">
        <div class="ability-icon">👁️</div>
        <div class="ability-info">
          <span class="ability-name">ORACOLO</span>
          <span class="ability-cost">Cost: 30%</span>
        </div>
        <div class="ability-hotkey">Tasto [2]</div>
      </button>

      <!-- Instant Defeat Ability -->
      <button id="ability-gladius" class="ability-card gold-border" disabled data-hotkey="3">
        <div class="ability-icon">⚔️</div>
        <div class="ability-info">
          <span class="ability-name">GLADIVS</span>
          <span class="ability-cost">Cost: 60%</span>
        </div>
        <div class="ability-hotkey">Tasto [3]</div>
      </button>
    </div>

    <!-- Active Shield Notification -->
    <div id="shield-active-indicator" class="shield-badge hidden">
      🛡️ SCVTVM ATTIVO: Il prossimo colpo errato sarà parato!
    </div>
  </div>

</section>
```

---

### Screen 3: Game Over Screen (`#game-over-screen`)
Displays stats symmetrically in marble blocks, summarizing the accomplishments before allowing the gladiator to re-enter.

```html
<section id="game-over-screen" class="screen hidden">
  <div class="marble-panel centered-panel text-center">
    
    <header class="arena-header">
      <h1 class="cinzel-title crimson-text">VALE, GLADIATOR!</h1>
      <p class="cinzel-subtitle">You have fought honorably, but fallen in battle</p>
    </header>

    <!-- Symmetrical Stats Grid -->
    <div class="stats-card gold-border">
      <h3 class="section-title">Final Statistics</h3>
      
      <div class="stats-grid">
        <div class="stat-block gold-border">
          <span class="stat-label">Total Score</span>
          <span id="final-score" class="stat-number gold-text">0</span>
        </div>
        
        <div class="stat-block gold-border">
          <span class="stat-label">Defeated Foes</span>
          <span id="final-words-defeated" class="stat-number gold-text">0</span>
        </div>

        <div class="stat-block gold-border">
          <span class="stat-label">Max Streak</span>
          <span id="final-streak" class="stat-number gold-text">0</span>
        </div>

        <div class="stat-block gold-border">
          <span class="stat-label">Max Level Reached</span>
          <span id="final-difficulty" class="stat-number gold-text">Level 1</span>
        </div>
      </div>
    </div>

    <button id="restart-btn" class="roman-btn gold-border cinzel-title">RE-ENTER THE ARENA</button>
  </div>
</section>
```

---

## 4. CSS Layout & Symmetrical Design Strategy

### Container Alignment & Body Setup
To give the feeling of a heavy stone arena board:
* **Background Styling**: Use a fine pattern resembling dark roman stone or marble.
* **Centering**: Use Flexbox on `body` or a main wrapper to center `.arena-container` on the screen.
* **Symmetry**: Set strict `max-width` limits (e.g., `1000px`) for `.arena-container` and center elements using `margin: 0 auto`.

### Grid System for the Battle Screen
The Battle Screen utilizes a grid to cleanly partition elements:
```css
.combat-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr; /* Symmetrical split, giving slightly more room to the word card */
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .combat-grid {
    grid-template-columns: 1fr; /* Stacks vertically on mobile devices */
  }
}
```

### Marble Slab Styling (The `.marble-panel`)
Panels should feel solid and heavy:
```css
.marble-panel {
  background: var(--color-marble-white);
  border: 4px double var(--color-gold); /* Imperial double-gold border */
  border-radius: 4px;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.4), 
    inset 0 0 40px var(--color-marble-shadow); /* Marble shading */
  padding: 25px;
  color: var(--color-text-dark);
}
```

---

## 5. CSS Micro-Animation & Feedback Selectors

To prepare the styling file (`styles.css`) for Milestone M5 dynamic animations, we define the following CSS classes and keyframes hooks:

### 1. Screen Shake (`.damage-shake`)
Applied dynamically to `body` or `.arena-container` when the player takes damage:
```css
.damage-shake {
  animation: shake 0.15s ease-in-out 3;
}

@keyframes shake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-8px, 6px) rotate(-1deg); }
  50% { transform: translate(6px, -6px) rotate(1deg); }
  75% { transform: translate(-6px, -4px) rotate(-0.5deg); }
  100% { transform: translate(0, 0); }
}
```

### 2. Slash Flash on Enemy Gladiator (`.flash-active`)
Applied to the `#slash-flash` overlay when a correct answer deals a strike:
```css
.slash-flash-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.flash-active {
  animation: slash-flash 0.3s ease-out;
}

@keyframes slash-flash {
  0% { opacity: 0.8; background: #ffffff; }
  50% { opacity: 0.5; background: var(--color-gold); }
  100% { opacity: 0; }
}
```

### 3. Audio Initialization Prompt (`.audio-banner`)
Fades out once the user clicks anywhere on the screen:
```css
.audio-banner {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(128, 0, 32, 0.9); /* Imperial Purple */
  border: 1px solid var(--color-gold);
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: var(--font-headers);
  font-size: 0.85rem;
  z-index: 1000;
  transition: opacity 0.5s ease-out;
  cursor: pointer;
}
.audio-banner.hidden {
  opacity: 0;
  pointer-events: none;
}
```

---

## 6. Recommendations & Integration Hook points

1. **State Management Hook**: The `app.js` module should toggle screen visibility simple by removing `.hidden` and adding `.active` to screen sections:
   ```javascript
   function showScreen(screenId) {
     document.querySelectorAll('.screen').forEach(s => {
       s.classList.add('hidden');
       s.classList.remove('active');
     });
     document.getElementById(screenId).classList.remove('hidden');
     document.getElementById(screenId).classList.add('active');
   }
   ```
2. **Caecus Letter Masking**: The letter hiding mechanism can use HTML `<span>` wrapping for individual characters, where masked characters are hidden using CSS style rules (e.g. `visibility: hidden` but keeping space via `visibility: hidden` or utilizing underscore placeholders `_`).
3. **Form Submissions**: Always use `<form>` and submit events rather than raw button clicks on the answer field to ensure proper mobile behavior (soft-keyboard "Go" / "Submit" key triggers the action naturally).
