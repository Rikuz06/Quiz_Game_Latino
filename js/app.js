import { getShuffledWords, getRandomWord } from './vocab.js';
import { RomanArenaAudio } from './sound.js';

// Game States
const States = {
  START: 'START',
  BATTLE: 'BATTLE',
  GAMEOVER: 'GAMEOVER'
};

let currentState = States.START;
let isGameRunning = false;
let isStarting = false;
let isProcessingSubmit = false;

// Game State Variables
let playerHP = 100;
let score = 0;
let streak = 0;
let maxStreak = 0;
let wordsDefeated = 0;
let favor = 0;
let scutumActive = false;
let enemyHP = 100;
let activeWord = null;

// Shuffled word queue: all words in random order
let wordQueue = [];
let wordIndex = 0;
let totalWords = 0;
let answeredWords = 0;

// Timer State
let timerInterval = null;

// Visual Effects Toggle
let visualEffectsActive = true;

/**
 * Transition the game UI between Start, Battle, and Game Over screens.
 * Updates aria attributes and disables inputs where appropriate.
 */
function transitionTo(newState) {
  currentState = newState;

  const startScreen = document.getElementById('start-screen');
  const battleScreen = document.getElementById('battle-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const inputAnswer = document.getElementById('input-answer');

  // Hide all screens by default and remove active class
  const allScreens = [startScreen, battleScreen, gameOverScreen];
  allScreens.forEach(screen => {
    if (screen) {
      screen.classList.add('hidden');
      screen.classList.remove('active');
      screen.setAttribute('aria-hidden', 'true');
    }
  });

  // Manage answer input disabled state
  if (inputAnswer) {
    inputAnswer.disabled = true;
  }

  // Show the target screen
  let targetScreen = null;
  switch (newState) {
    case States.START:
      targetScreen = startScreen;
      break;
    case States.BATTLE:
      targetScreen = battleScreen;
      if (inputAnswer) {
        inputAnswer.disabled = false;
        inputAnswer.focus();
      }
      break;
    case States.GAMEOVER:
      targetScreen = gameOverScreen;
      break;
  }

  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
    targetScreen.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Helper to update feedback messages
 */
function showFeedback(msg) {
  const fb = document.getElementById('feedback-message');
  if (fb) {
    fb.textContent = msg;
  }
}

/**
 * Helper to generate masked string for Caecus modifier (even index visible, odd index masked)
 */
function maskWord(word) {
  let masked = "";
  for (let i = 0; i < word.length; i++) {
    if (i % 2 === 1) {
      masked += "_";
    } else {
      masked += word[i];
    }
  }
  return masked;
}

/**
 * Sync Crowd Favor Gauge with the UI and toggle locked states on the ability buttons.
 */
function updateFavorUI() {
  const favorBarInner = document.querySelector('#crowd-favor-bar .favor-bar-inner');
  if (favorBarInner) {
    favorBarInner.style.width = favor + '%';
  }

  const favorText = document.getElementById('player-favor-text');
  if (favorText) {
    favorText.textContent = favor + '%';
  }

  const favorBar = document.getElementById('crowd-favor-bar');
  if (favorBar) {
    favorBar.setAttribute('aria-valuenow', favor);
    favorBar.setAttribute('aria-valuetext', `${favor} percento di favore`);
  }

  const btnScutum = document.getElementById('btn-ability-scutum');
  const btnOracolo = document.getElementById('btn-ability-oracolo');
  const btnGladius = document.getElementById('btn-ability-gladius');

  if (btnScutum) {
    if (favor >= 40 && !scutumActive) {
      btnScutum.classList.remove('locked');
      btnScutum.setAttribute('aria-disabled', 'false');
    } else {
      btnScutum.classList.add('locked');
      btnScutum.setAttribute('aria-disabled', 'true');
    }
  }

  if (btnOracolo) {
    if (favor >= 30) {
      btnOracolo.classList.remove('locked');
      btnOracolo.setAttribute('aria-disabled', 'false');
    } else {
      btnOracolo.classList.add('locked');
      btnOracolo.setAttribute('aria-disabled', 'true');
    }
  }

  if (btnGladius) {
    if (favor >= 60) {
      btnGladius.classList.remove('locked');
      btnGladius.setAttribute('aria-disabled', 'false');
    } else {
      btnGladius.classList.add('locked');
      btnGladius.setAttribute('aria-disabled', 'true');
    }
  }
}

/**
 * Sync Enemy HP Gauge with the UI
 */
function updateEnemyHPUI() {
  const enemyHPText = document.getElementById('enemy-hp');
  if (enemyHPText) {
    enemyHPText.textContent = enemyHP;
  }

  const enemyHPFill = document.querySelector('#enemy-hp-bar .enemy-hp-fill');
  if (enemyHPFill) {
    enemyHPFill.style.width = enemyHP + '%';
  }

  const enemyHPBar = document.getElementById('enemy-hp-bar');
  if (enemyHPBar) {
    enemyHPBar.setAttribute('aria-valuenow', enemyHP);
    enemyHPBar.setAttribute('aria-valuetext', `${enemyHP} su 100 HP`);
  }
}

/**
 * Sync Player HP Gauge with the UI
 */
function updatePlayerHPUI() {
  const playerHPText = document.getElementById('player-hp');
  if (playerHPText) {
    playerHPText.textContent = playerHP;
  }

  const playerHPFill = document.querySelector('#player-hp-bar .player-hp-fill');
  if (playerHPFill) {
    playerHPFill.style.width = playerHP + '%';
  }

  const playerHPBar = document.getElementById('player-hp-bar');
  if (playerHPBar) {
    playerHPBar.setAttribute('aria-valuenow', playerHP);
    playerHPBar.setAttribute('aria-valuetext', `${playerHP} su 100 HP`);
  }
}

/**
 * Clear the countdown timer interval
 */
function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Start or reset the Tempus countdown timer
 */
function startTimer() {
  clearTimer();

  const timerContainer = document.getElementById('timer-container');
  const modifierTempus = document.getElementById('modifier-tempus');

  if (score > 15) {
    if (modifierTempus) modifierTempus.classList.remove('hidden');
    if (timerContainer) timerContainer.classList.remove('hidden');

    const maxTime = Math.max(8, 12 - (score - 16) * 0.12);
    let remainingTime = maxTime;

    const timerCountdown = document.getElementById('timer-countdown');
    const timerBar = document.getElementById('timer-bar');

    if (timerCountdown) timerCountdown.textContent = remainingTime.toFixed(1) + 's';
    if (timerBar) timerBar.style.width = '100%';

    timerInterval = setInterval(() => {
      remainingTime -= 0.1;
      if (remainingTime <= 0) {
        remainingTime = 0;
        if (timerCountdown) timerCountdown.textContent = '0.0s';
        if (timerBar) timerBar.style.width = '0%';
        clearTimer();
        handleIncorrectAnswer(true); // Timeout damage
      } else {
        if (timerCountdown) timerCountdown.textContent = remainingTime.toFixed(1) + 's';
        if (timerBar) timerBar.style.width = (remainingTime / maxTime * 100) + '%';
      }
    }, 100);
  } else {
    if (modifierTempus) modifierTempus.classList.add('hidden');
    if (timerContainer) timerContainer.classList.add('hidden');
  }
}

/**
 * Enemy gladiator types with SVG art and unique visual styles
 */
const ENEMY_TYPES = [
  {
    name: "PROVOCATOR",
    color: "#c62828",
    accent: "#ff5252",
    icon: "helmet-provocator",
    title: "Il Provocatore"
  },
  {
    name: "RETIARIVS",
    color: "#1565C0",
    accent: "#42A5F5",
    icon: "helmet-retiarius",
    title: "Il Reziario"
  },
  {
    name: "SECVTOR",
    color: "#2E7D32",
    accent: "#66BB6A",
    icon: "helmet-secutor",
    title: "Il Secutore"
  },
  {
    name: "MIRMILLO",
    color: "#E65100",
    accent: "#FF9800",
    icon: "helmet-murmillo",
    title: "Il Mirmillone"
  },
  {
    name: "THREX",
    color: "#6A1B9A",
    accent: "#AB47BC",
    icon: "helmet-thraex",
    title: "Il Trace"
  },
  {
    name: "DIMACHAERVS",
    color: "#4E342E",
    accent: "#8D6E63",
    icon: "helmet-dimachaerus",
    title: "Il Dimachero"
  },
  {
    name: "HOPLOMACHUS",
    color: "#00695C",
    accent: "#26A69A",
    icon: "helmet-hoplomachus",
    title: "L'Oplomaco"
  },
  {
    name: "EQVES",
    color: "#37474F",
    accent: "#78909C",
    icon: "helmet-eques",
    title: "L'Equite"
  }
];

let currentEnemyType = ENEMY_TYPES[0];

/**
 * Generate SVG gladiator helmet art based on enemy type
 */
function generateEnemySVG(enemyType) {
  const color = enemyType.color;
  const accent = enemyType.accent;
  
  const svgTemplates = {
    'helmet-provocator': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="60" cy="50" rx="38" ry="42" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M22 50 Q30 85 60 95 Q90 85 98 50" fill="${color}" stroke="#d4af37" stroke-width="1.5" opacity="0.9"/>
      <rect x="25" y="55" width="70" height="8" rx="4" fill="#1a1a1a" opacity="0.85"/>
      <circle cx="42" cy="59" r="4" fill="${accent}" filter="url(#glow)"/>
      <circle cx="78" cy="59" r="4" fill="${accent}" filter="url(#glow)"/>
      <path d="M35 75 Q60 82 85 75" fill="none" stroke="#1a1a1a" stroke-width="2" opacity="0.6"/>
      <path d="M60 8 L55 22 L65 22 Z" fill="#d4af37"/>
      <line x1="60" y1="2" x2="60" y2="12" stroke="#d4af37" stroke-width="2"/>
    </svg>`,
    'helmet-retiarius': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="55" r="38" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M30 45 Q60 35 90 45 Q95 65 90 75 Q60 90 30 75 Q25 65 30 45Z" fill="${color}" stroke="#d4af37" stroke-width="1" opacity="0.7"/>
      <line x1="30" y1="50" x2="90" y2="50" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
      <line x1="35" y1="60" x2="85" y2="60" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
      <line x1="40" y1="70" x2="80" y2="70" stroke="#d4af37" stroke-width="1" opacity="0.5"/>
      <line x1="50" y1="40" x2="50" y2="80" stroke="#d4af37" stroke-width="1" opacity="0.3"/>
      <line x1="70" y1="40" x2="70" y2="80" stroke="#d4af37" stroke-width="1" opacity="0.3"/>
      <circle cx="45" cy="55" r="5" fill="#0d47a1" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <circle cx="75" cy="55" r="5" fill="#0d47a1" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <path d="M15 30 L25 15 L35 25" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    'helmet-secutor': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M25 60 Q25 20 60 15 Q95 20 95 60 Q95 90 60 100 Q25 90 25 60Z" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M30 55 Q60 50 90 55 L88 65 Q60 60 32 65Z" fill="#1a1a1a" opacity="0.8"/>
      <circle cx="45" cy="58" r="4" fill="${accent}" filter="url(#glow)"/>
      <circle cx="75" cy="58" r="4" fill="${accent}" filter="url(#glow)"/>
      <path d="M45 78 Q60 85 75 78" fill="none" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M60 15 Q55 5 60 2 Q65 5 60 15" fill="#d4af37"/>
    </svg>`,
    'helmet-murmillo': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="60" cy="55" rx="40" ry="40" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M35 10 Q60 0 85 10 Q75 25 60 20 Q45 25 35 10Z" fill="#d4af37" opacity="0.9"/>
      <path d="M50 8 Q60 -2 70 8" fill="none" stroke="#b8860b" stroke-width="3" stroke-linecap="round"/>
      <rect x="28" y="50" width="64" height="10" rx="5" fill="#1a1a1a" opacity="0.8"/>
      <circle cx="42" cy="55" r="5" fill="#bf360c" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <circle cx="78" cy="55" r="5" fill="#bf360c" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <path d="M22 55 L18 65 Q20 70 25 68" fill="${color}" stroke="#d4af37" stroke-width="1"/>
      <path d="M98 55 L102 65 Q100 70 95 68" fill="${color}" stroke="#d4af37" stroke-width="1"/>
    </svg>`,
    'helmet-thraex': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M25 55 Q25 18 60 12 Q95 18 95 55 Q95 88 60 98 Q25 88 25 55Z" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M40 12 Q50 -5 60 5 Q70 -5 80 12" fill="#d4af37" stroke="#b8860b" stroke-width="1.5"/>
      <path d="M60 5 L58 -5 L62 -5 Z" fill="#d4af37"/>
      <path d="M30 50 L90 50 L88 62 L32 62Z" fill="#1a1a1a" opacity="0.85"/>
      <circle cx="44" cy="56" r="4.5" fill="${accent}" filter="url(#glow)"/>
      <circle cx="76" cy="56" r="4.5" fill="${accent}" filter="url(#glow)"/>
      <path d="M42 76 L60 82 L78 76" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'helmet-dimachaerus': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="60" cy="52" rx="38" ry="42" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M22 55 L15 70" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
      <path d="M98 55 L105 70" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
      <path d="M10 72 L15 65 L20 75Z" fill="#d4af37"/>
      <path d="M100 75 L105 65 L110 72Z" fill="#d4af37"/>
      <rect x="28" y="50" width="64" height="9" rx="4" fill="#1a1a1a" opacity="0.85"/>
      <circle cx="44" cy="54" r="4" fill="${accent}" filter="url(#glow)"/>
      <circle cx="76" cy="54" r="4" fill="${accent}" filter="url(#glow)"/>
      <path d="M40 74 Q60 80 80 74" fill="none" stroke="#1a1a1a" stroke-width="2"/>
    </svg>`,
    'helmet-hoplomachus': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M22 58 Q22 15 60 10 Q98 15 98 58 Q98 92 60 100 Q22 92 22 58Z" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M45 10 Q52 -8 60 5 Q68 -8 75 10" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="60" cy="-2" r="4" fill="#d4af37"/>
      <path d="M28 52 Q60 46 92 52 L90 64 Q60 58 30 64Z" fill="#1a1a1a" opacity="0.8"/>
      <circle cx="44" cy="56" r="5" fill="#004d40" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <circle cx="76" cy="56" r="5" fill="#004d40" stroke="${accent}" stroke-width="1.5" filter="url(#glow)"/>
      <path d="M44 78 Q60 86 76 78" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'helmet-eques': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="60" cy="52" rx="40" ry="43" fill="url(#helm-grad)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M30 20 Q35 5 45 12" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M90 20 Q85 5 75 12" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M30 48 Q60 42 90 48 L88 60 Q60 54 32 60Z" fill="#1a1a1a" opacity="0.8"/>
      <circle cx="44" cy="53" r="4.5" fill="${accent}" filter="url(#glow)"/>
      <circle cx="76" cy="53" r="4.5" fill="${accent}" filter="url(#glow)"/>
      <path d="M44 76 Q60 82 76 76" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 58 L16 72 Q18 76 22 74" fill="${color}" stroke="#d4af37" stroke-width="1"/>
      <path d="M100 58 L104 72 Q102 76 98 74" fill="${color}" stroke="#d4af37" stroke-width="1"/>
    </svg>`
  };
  
  return svgTemplates[enemyType.icon] || svgTemplates['helmet-provocator'];
}

/**
 * Render the current enemy in the avatar container
 */
function renderEnemy(enemyType) {
  currentEnemyType = enemyType;
  
  const enemyNameEl = document.getElementById('enemy-name');
  if (enemyNameEl) {
    enemyNameEl.textContent = enemyType.name;
  }
  
  const enemyTitleEl = document.getElementById('enemy-title');
  if (enemyTitleEl) {
    enemyTitleEl.textContent = enemyType.title;
  }
  
  const avatarContainer = document.querySelector('.enemy-avatar-container');
  if (avatarContainer) {
    // Remove old avatar icon, keep slash flash
    const oldIcon = avatarContainer.querySelector('.avatar-icon');
    if (oldIcon) oldIcon.remove();
    const oldSvg = avatarContainer.querySelector('.enemy-svg-art');
    if (oldSvg) oldSvg.remove();
    
    const svgWrapper = document.createElement('div');
    svgWrapper.className = 'enemy-svg-art';
    svgWrapper.innerHTML = generateEnemySVG(enemyType);
    avatarContainer.appendChild(svgWrapper);
    
    // Update avatar container border color to match enemy
    avatarContainer.style.borderColor = enemyType.accent;
    avatarContainer.style.boxShadow = `0 0 20px ${enemyType.color}44, inset 0 0 15px ${enemyType.color}22, 0 4px 12px rgba(0,0,0,0.3)`;
    
    // Add entrance animation
    avatarContainer.classList.add('enemy-entrance');
    setTimeout(() => {
      avatarContainer.classList.remove('enemy-entrance');
    }, 600);
  }
}

/**
 * Get a random enemy type
 */
function getRandomEnemyType() {
  return ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
}

/**
 * Load the next vocabulary word — pulls from shuffled queue of ALL words
 */
function loadNextWord() {
  // Clear any existing timer
  clearTimer();

  // Clear answer field and focus
  const inputEl = document.getElementById('input-answer');
  if (inputEl) {
    inputEl.value = "";
    if (currentState === States.BATTLE) {
      inputEl.focus();
    }
  }

  // Clear Oracolo hint display
  const clueDisplay = document.getElementById('clue-display');
  if (clueDisplay) {
    clueDisplay.textContent = "";
  }

  // If we've exhausted the queue, reshuffle
  if (wordIndex >= wordQueue.length) {
    wordQueue = getShuffledWords();
    wordIndex = 0;
  }

  // Pull next word from queue
  activeWord = wordQueue[wordIndex];
  wordIndex++;

  // Update progress display
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) {
    levelDisplay.textContent = `${answeredWords} / ${totalWords}`;
  }

  // Bind to #latin-word (and mask if Caecus active)
  const latinWordEl = document.getElementById('latin-word');
  const modifierCaecus = document.getElementById('modifier-caecus');

  if (activeWord && latinWordEl) {
    if (score > 30) {
      latinWordEl.textContent = maskWord(activeWord.latin);
      if (modifierCaecus) modifierCaecus.classList.remove('hidden');
    } else {
      latinWordEl.textContent = activeWord.latin;
      if (modifierCaecus) modifierCaecus.classList.add('hidden');
    }
  }

  // Display/Hide Double Damage modifier
  const modifierDoubleDamage = document.getElementById('modifier-double-damage');
  if (modifierDoubleDamage) {
    if (score > 45) {
      modifierDoubleDamage.classList.remove('hidden');
    } else {
      modifierDoubleDamage.classList.add('hidden');
    }
  }

  // Reset/Start timer
  startTimer();

  // Reset submit flag now that a new word is fully loaded
  isProcessingSubmit = false;
}

/**
 * Core Logic for Correct Answers
 */
function handleCorrectAnswer() {
  score += 1;
  streak += 1;
  wordsDefeated += 1;
  maxStreak = Math.max(maxStreak, streak);

  // Sync HUD
  const scoreEl = document.getElementById('player-score');
  if (scoreEl) scoreEl.textContent = score;

  const streakEl = document.getElementById('player-streak');
  if (streakEl) streakEl.textContent = streak;

  // Add Favor
  favor = Math.min(100, favor + 10);
  updateFavorUI();

  // Play Sound
  if (streak > 0 && streak % 5 === 0) {
    RomanArenaAudio.playCheer();
  } else {
    RomanArenaAudio.playCorrect();
  }

  // Damage Enemy
  enemyHP = Math.max(0, enemyHP - 34);
  updateEnemyHPUI();

  // Trigger Slash Overlay Visual effect
  if (visualEffectsActive) {
    const slashFlash = document.getElementById('slash-flash');
    if (slashFlash) {
      slashFlash.classList.add('flash-active', 'flash-hit');
      setTimeout(() => {
        slashFlash.classList.remove('flash-active', 'flash-hit');
      }, 300);
    }
  }

  // Track answered words
  answeredWords++;

  // Resolve Enemy Defeat
  if (enemyHP <= 0) {
    enemyHP = 100;
    updateEnemyHPUI();

    RomanArenaAudio.playCheer();

    // Spawn a new random enemy with unique visuals
    const newEnemy = getRandomEnemyType();
    renderEnemy(newEnemy);

    showFeedback("🏆 Nemico sconfitto! Sotto con il prossimo!");
  } else {
    showFeedback("⚔️ Colpo a segno!");
  }

  // Progress Loop
  loadNextWord();
}

/**
 * Core Logic for Incorrect Answers (and Timeouts)
 */
function handleIncorrectAnswer(isTimeout = false) {
  streak = 0;
  const streakEl = document.getElementById('player-streak');
  if (streakEl) streakEl.textContent = streak;

  if (scutumActive) {
    // Mitigate damage
    scutumActive = false;
    const shieldBadge = document.getElementById('status-scutum-active');
    if (shieldBadge) {
      shieldBadge.classList.add('hidden');
    }
    updateFavorUI();
    RomanArenaAudio.playShield();
    showFeedback("🛡️ Danno parato dallo Scutum!");
  } else {
    // Deduct HP
    const damage = (score > 45) ? 30 : 15;
    playerHP = Math.max(0, playerHP - damage);
    updatePlayerHPUI();

    RomanArenaAudio.playIncorrect();

    // Trigger Screen Shake visual effect
    if (visualEffectsActive) {
      const arena = document.getElementById('arena-container') || document.body;
      if (arena) {
        arena.classList.add('shake-damage', 'shake-active', 'shake');
        setTimeout(() => {
          arena.classList.remove('shake-damage', 'shake-active', 'shake');
        }, 400);
      }
    }

    if (isTimeout) {
      showFeedback(`⏱️ Tempo scaduto! Subisci ${damage} danni!`);
    } else {
      showFeedback(`❌ Risposta errata! Subisci ${damage} danni!`);
    }

    if (playerHP <= 0) {
      triggerGameOver();
      return;
    }
  }

  // Progress Loop
  loadNextWord();
}

/**
 * Ability: Activate Scutum
 */
function useScutum() {
  if (currentState !== States.BATTLE) return;
  if (favor < 40 || scutumActive) return;

  favor -= 40;
  scutumActive = true;

  const shieldBadge = document.getElementById('status-scutum-active');
  if (shieldBadge) {
    shieldBadge.classList.remove('hidden');
  }

  updateFavorUI();
  RomanArenaAudio.playShield();
  showFeedback("🛡️ Scutum attivato! Il prossimo colpo errato sarà parato!");
}

/**
 * Ability: Activate Oracolo
 */
function useOracolo() {
  if (currentState !== States.BATTLE) return;
  if (favor < 30) return;

  favor -= 30;
  updateFavorUI();

  const clueDisplay = document.getElementById('clue-display');
  if (clueDisplay && activeWord) {
    clueDisplay.textContent = activeWord.clue || `Indizio: Traduzione di '${activeWord.latin}'`;
  }

  showFeedback("👁️ L'Oracolo rivela un indizio!");
}

/**
 * Ability: Activate Gladius
 */
function useGladius() {
  if (currentState !== States.BATTLE) return;
  if (favor < 60) return;

  favor -= 60;
  score += 2;
  wordsDefeated += 1;
  streak += 1;
  maxStreak = Math.max(maxStreak, streak);

  // Sync HUD
  const scoreEl = document.getElementById('player-score');
  if (scoreEl) scoreEl.textContent = score;

  const streakEl = document.getElementById('player-streak');
  if (streakEl) streakEl.textContent = streak;

  updateFavorUI();
  RomanArenaAudio.playGladius();

  // Enemy flash visual effect
  if (visualEffectsActive) {
    const slashFlash = document.getElementById('slash-flash');
    if (slashFlash) {
      slashFlash.classList.add('flash-active', 'flash-hit');
      setTimeout(() => {
        slashFlash.classList.remove('flash-active', 'flash-hit');
      }, 300);
    }
  }

  showFeedback("⚔️ Gladius! Colpo micidiale inflitto!");

  // Progress Loop
  loadNextWord();
}

/**
 * Trigger Game Over screen and bind final stats
 */
function triggerGameOver() {
  clearTimer();
  isGameRunning = false;

  const finalScoreEl = document.getElementById('stats-final-score');
  if (finalScoreEl) finalScoreEl.textContent = score;

  const wordsDefeatedEl = document.getElementById('stats-words-defeated');
  if (wordsDefeatedEl) wordsDefeatedEl.textContent = wordsDefeated;

  const maxStreakEl = document.getElementById('stats-max-streak');
  if (maxStreakEl) maxStreakEl.textContent = maxStreak;

  transitionTo(States.GAMEOVER);
}

/**
 * Initialize / Starts the Game session
 */
function startGame() {
  if (isGameRunning || isStarting) return;
  isStarting = true;
  setTimeout(() => {
    isStarting = false;
  }, 300);

  isGameRunning = true;

  // Initialize Web Audio API Context
  RomanArenaAudio.init();

  // Reset Variables
  playerHP = 100;
  score = 0;
  streak = 0;
  maxStreak = 0;
  wordsDefeated = 0;
  favor = 0;
  scutumActive = false;
  enemyHP = 100;
  activeWord = null;
  answeredWords = 0;

  // Shuffle all words
  wordQueue = getShuffledWords();
  wordIndex = 0;
  totalWords = wordQueue.length;

  // Reset UI elements
  updatePlayerHPUI();
  updateEnemyHPUI();
  updateFavorUI();

  const scoreEl = document.getElementById('player-score');
  if (scoreEl) scoreEl.textContent = '0';

  const streakEl = document.getElementById('player-streak');
  if (streakEl) streakEl.textContent = '0';

  const shieldBadge = document.getElementById('status-scutum-active');
  if (shieldBadge) shieldBadge.classList.add('hidden');

  showFeedback("");

  // Spawn initial enemy
  renderEnemy(getRandomEnemyType());

  // Transition and Load
  transitionTo(States.BATTLE);
  loadNextWord();
}

/**
 * Restart the game from game over screen
 */
function restartGame() {
  if (isStarting) return;
  isStarting = true;
  setTimeout(() => {
    isStarting = false;
  }, 300);

  clearTimer();
  isGameRunning = true;

  // Re-init audio (uses same context safely internally)
  RomanArenaAudio.init();

  // Reset Variables
  playerHP = 100;
  score = 0;
  streak = 0;
  maxStreak = 0;
  wordsDefeated = 0;
  favor = 0;
  scutumActive = false;
  enemyHP = 100;
  activeWord = null;
  answeredWords = 0;

  // Shuffle all words
  wordQueue = getShuffledWords();
  wordIndex = 0;
  totalWords = wordQueue.length;

  // Reset UI
  updatePlayerHPUI();
  updateEnemyHPUI();
  updateFavorUI();

  const scoreEl = document.getElementById('player-score');
  if (scoreEl) scoreEl.textContent = '0';

  const streakEl = document.getElementById('player-streak');
  if (streakEl) streakEl.textContent = '0';

  const shieldBadge = document.getElementById('status-scutum-active');
  if (shieldBadge) shieldBadge.classList.add('hidden');

  showFeedback("");

  // Spawn initial enemy
  renderEnemy(getRandomEnemyType());

  // Transition and Load
  transitionTo(States.BATTLE);
  loadNextWord();
}

/**
 * Handle form answer submissions
 */
function handleAnswerSubmit(e) {
  if (e) e.preventDefault();

  if (currentState !== States.BATTLE) return;

  // Double submit protection
  if (isProcessingSubmit) return;
  isProcessingSubmit = true;

  const inputEl = document.getElementById('input-answer');
  if (!inputEl) {
    isProcessingSubmit = false;
    return;
  }

  const rawAnswer = inputEl.value;
  const answer = rawAnswer.trim();

  if (answer === "") {
    handleIncorrectAnswer(false);
    return;
  }

  if (activeWord) {
    const isCorrect = answer.toLowerCase() === activeWord.italian.toLowerCase();
    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer(false);
    }
  }
}

// Event Listeners Wire Up
document.addEventListener('DOMContentLoaded', () => {
  // Screen elements setup
  transitionTo(States.START);

  // Wire buttons
  const btnStart = document.getElementById('btn-start');
  if (btnStart) {
    btnStart.addEventListener('click', startGame);
  }

  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    btnRestart.addEventListener('click', restartGame);
  }

  const btnSubmit = document.getElementById('btn-submit');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', handleAnswerSubmit);
  }

  const answerForm = document.getElementById('answer-form');
  if (answerForm) {
    answerForm.addEventListener('submit', handleAnswerSubmit);
  }

  const btnScutum = document.getElementById('btn-ability-scutum');
  if (btnScutum) {
    btnScutum.addEventListener('click', useScutum);
  }

  const btnOracolo = document.getElementById('btn-ability-oracolo');
  if (btnOracolo) {
    btnOracolo.addEventListener('click', useOracolo);
  }

  const btnGladius = document.getElementById('btn-ability-gladius');
  if (btnGladius) {
    btnGladius.addEventListener('click', useGladius);
  }

  const toggleAccessibilityBtn = document.getElementById('toggle-accessibility-motion');
  if (toggleAccessibilityBtn) {
    toggleAccessibilityBtn.addEventListener('click', () => {
      visualEffectsActive = !visualEffectsActive;
      toggleAccessibilityBtn.textContent = visualEffectsActive ? "EFFETTI VISIVI: ATTIVI" : "EFFETTI VISIVI: DISATTIVI";
    });
  }

  // Keyboard Hotkeys
  window.addEventListener('keydown', (e) => {
    const inputAnswer = document.getElementById('input-answer');
    if (document.activeElement === inputAnswer) {
      return; // Do not trigger hotkeys when writing inside the input
    }

    const key = e.key.toLowerCase();
    if (key === '1' || key === 's') {
      e.preventDefault();
      useScutum();
    } else if (key === '2' || key === 'o') {
      e.preventDefault();
      useOracolo();
    } else if (key === '3' || key === 'g') {
      e.preventDefault();
      useGladius();
    }
  });

  // Background audio setup on any first interaction (fallback compliance)
  document.addEventListener('click', () => {
    RomanArenaAudio.init();
    const initBanner = document.getElementById('audio-init-banner');
    if (initBanner) {
      initBanner.classList.add('hidden');
    }
  }, { once: true });
});
