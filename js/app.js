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
let defeatedEmperors = [];

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

function getCurrentLevel() {
  if (score <= 5) return 1;
  if (score <= 15) return 2;
  if (score <= 30) return 3;
  if (score <= 50) return 4;
  return 5;
}

function showVictoryBanner(emperorName) {
  const banner = document.getElementById('victory-banner');
  const bannerTitle = document.getElementById('victory-banner-title');
  const bannerMsg = document.getElementById('victory-banner-message');
  if (banner) {
    if (bannerTitle) bannerTitle.textContent = "CESARE SCONFITTO!";
    if (bannerMsg) bannerMsg.textContent = `${emperorName} ha ceduto al tuo valore nell'arena!`;
    banner.classList.remove('hidden');
    banner.classList.add('active');
    setTimeout(() => {
      banner.classList.remove('active');
      banner.classList.add('hidden');
    }, 2500);
  }
}

function updateTrophyUI() {
  const listEl = document.getElementById('defeated-emperors-list');
  if (listEl) {
    if (defeatedEmperors.length === 0) {
      listEl.innerHTML = '<span class="no-trophies-text">Nessun Cesare sconfitto</span>';
    } else {
      listEl.innerHTML = defeatedEmperors.map(name => `
        <div class="trophy-item">
          <span class="trophy-icon">👑</span>
          <span class="trophy-name">${name}</span>
        </div>
      `).join('');
    }
  }
}

/**
 * Helper to update feedback messages
 */
function showFeedback(msg) {
  const fb = document.getElementById('feedback-message');
  if (fb) {
    fb.innerHTML = msg;
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
    name: "AVGVSTVS",
    color: "#1b5e20",
    accent: "#4caf50",
    icon: "emperor-augustus",
    title: "Il Fondatore dell'Impero"
  },
  {
    name: "NERO",
    color: "#b71c1c",
    accent: "#f44336",
    icon: "emperor-nero",
    title: "L'Artista Folle"
  },
  {
    name: "CALIGVLA",
    color: "#4a148c",
    accent: "#ab47bc",
    icon: "emperor-caligula",
    title: "Il Tiranno Stravagante"
  },
  {
    name: "TRAIANVS",
    color: "#0d47a1",
    accent: "#2196f3",
    icon: "emperor-trajan",
    title: "L'Ottimo Principe"
  },
  {
    name: "HADRIANVS",
    color: "#004d40",
    accent: "#26a69a",
    icon: "emperor-hadrian",
    title: "L'Imperatore Filosofo"
  },
  {
    name: "MARCVS AVRELIVS",
    color: "#3e2723",
    accent: "#8d6e63",
    icon: "emperor-marcus",
    title: "Il Saggio Stoico"
  },
  {
    name: "COMMODVS",
    color: "#e65100",
    accent: "#ff9800",
    icon: "emperor-commodus",
    title: "Il Gladiatore Cesare"
  },
  {
    name: "CONSTANTINVS",
    color: "#37474f",
    accent: "#78909c",
    icon: "emperor-constantine",
    title: "Il Grande Riformatore"
  }
];

let currentEnemyType = ENEMY_TYPES[0];

/**
 * Generate SVG imperial art based on enemy type
 */
function generateEnemySVG(enemyType) {
  const color = enemyType.color;
  const accent = enemyType.accent;
  
  const svgTemplates = {
    'emperor-augustus': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-augustus" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-augustus"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-augustus)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M35 60 Q45 35 60 35 Q75 35 85 60" fill="none" stroke="#ffd700" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/>
      <path d="M30 65 C32 82 50 90 60 90 C70 90 88 82 90 65" fill="none" stroke="#ffd700" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/>
      <text x="60" y="66" font-family="'Cinzel', serif" font-weight="bold" font-size="14" fill="#ffd700" text-anchor="middle" filter="url(#glow-augustus)">SPQR</text>
    </svg>`,
    'emperor-nero': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-nero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-nero"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-nero)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M35 65 L40 45 L50 53 L60 35 L70 53 L80 45 L85 65 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/>
      <path d="M42 45 Q50 25 46 15 Q55 28 60 25 Q65 15 70 32 Q78 20 78 45" fill="none" stroke="#ff3d00" stroke-width="2.5" filter="url(#glow-nero)"/>
      <circle cx="60" cy="65" r="5" fill="#ffd700" filter="url(#glow-nero)"/>
    </svg>`,
    'emperor-caligula': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-caligula" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-caligula"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-caligula)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M45 75 Q42 55 52 45 Q62 35 68 45 Q70 55 65 65 L68 75 Z" fill="#ffd700" opacity="0.8"/>
      <path d="M30 48 Q60 40 90 48" fill="none" stroke="#d4af37" stroke-width="3" filter="url(#glow-caligula)"/>
      <path d="M35 48 L32 38 L45 42 L60 30 L75 42 L88 38 L85 48" fill="none" stroke="#ffd700" stroke-width="2"/>
    </svg>`,
    'emperor-tiberius': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-tiberius" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-tiberius"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-tiberius)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M40 75 L40 55 L80 55 L80 75 Z" fill="#ffd700" opacity="0.6"/>
      <path d="M35 55 L60 38 L85 55 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/>
      <line x1="50" y1="55" x2="50" y2="75" stroke="#1a1a1a" stroke-width="2"/>
      <line x1="60" y1="55" x2="60" y2="75" stroke="#1a1a1a" stroke-width="2"/>
      <line x1="70" y1="55" x2="70" y2="75" stroke="#1a1a1a" stroke-width="2"/>
    </svg>`,
    'emperor-claudius': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-claudius" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-claudius"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-claudius)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M35 70 Q50 65 60 70 Q70 65 85 70 L85 45 Q70 40 60 45 Q50 40 35 45 Z" fill="#f5f2eb" stroke="#d4af37" stroke-width="1.5"/>
      <line x1="40" y1="52" x2="55" y2="52" stroke="#8b795e" stroke-width="1.5"/>
      <line x1="40" y1="60" x2="55" y2="60" stroke="#8b795e" stroke-width="1.5"/>
      <line x1="65" y1="52" x2="80" y2="52" stroke="#8b795e" stroke-width="1.5"/>
      <line x1="65" y1="60" x2="80" y2="60" stroke="#8b795e" stroke-width="1.5"/>
    </svg>`,
    'emperor-trajan': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-trajan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-trajan"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-trajan)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M60 35 L50 50 L35 45 L40 60 L52 65 L60 85 L68 65 L80 60 L85 45 L70 50 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1" filter="url(#glow-trajan)"/>
      <circle cx="60" cy="40" r="3" fill="#1a1a1a"/>
    </svg>`,
    'emperor-hadrian': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-hadrian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-hadrian"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-hadrian)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M35 72 C35 45 85 45 85 72 Z" fill="#ffd700" opacity="0.7"/>
      <circle cx="60" cy="52" r="5" fill="#1a1a1a" filter="url(#glow-hadrian)"/>
      <rect x="30" y="72" width="60" height="6" fill="#d4af37"/>
    </svg>`,
    'emperor-marcus': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-marcus" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-marcus"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="60" cy="60" r="42" fill="url(#helm-grad-marcus)" stroke="#d4af37" stroke-width="2.5"/>
      <circle cx="60" cy="60" r="28" fill="none" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
      <text x="60" y="42" font-size="12" fill="#ffd700" text-anchor="middle" filter="url(#glow-marcus)">★</text>
      <text x="40" y="55" font-size="12" fill="#ffd700" text-anchor="middle" filter="url(#glow-marcus)">★</text>
      <text x="80" y="55" font-size="12" fill="#ffd700" text-anchor="middle" filter="url(#glow-marcus)">★</text>
      <text x="50" y="75" font-size="12" fill="#ffd700" text-anchor="middle" filter="url(#glow-marcus)">★</text>
      <text x="70" y="75" font-size="12" fill="#ffd700" text-anchor="middle" filter="url(#glow-marcus)">★</text>
    </svg>`,
    'emperor-commodus': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-commodus" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-commodus"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="60" cy="52" rx="38" ry="42" fill="url(#helm-grad-commodus)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M30 48 Q60 42 90 48 L88 60 Q60 54 32 60Z" fill="#1a1a1a" opacity="0.8"/>
      <path d="M44 76 Q60 82 76 76" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
      <path d="M22 50 C10 30 15 80 60 92 C105 80 110 30 98 50" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="2 4"/>
    </svg>`,
    'emperor-constantine': `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="helm-grad-constantine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-constantine"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M22 58 Q22 15 60 10 Q98 15 98 58 Q98 92 60 100 Q22 92 22 58Z" fill="url(#helm-grad-constantine)" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M60 12 L60 85" stroke="#d4af37" stroke-width="3" filter="url(#glow-constantine)"/>
      <path d="M45 28 L75 28" stroke="#d4af37" stroke-width="3" filter="url(#glow-constantine)"/>
      <text x="60" y="24" font-size="12" fill="#ffd700" text-anchor="middle" font-weight="bold" filter="url(#glow-constantine)">XP</text>
    </svg>`
  };
  
  return svgTemplates[enemyType.icon] || svgTemplates['emperor-augustus'];
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
  window.activeWord = activeWord;
  wordIndex++;

  // Update progress display
  const levelDisplay = document.getElementById('level-display');
  if (levelDisplay) {
    levelDisplay.textContent = `Level ${getCurrentLevel()} (${answeredWords} / ${totalWords})`;
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

    // Trigger non-blocking victory banner
    showVictoryBanner(currentEnemyType.name);

    // Track defeated emperor
    if (!defeatedEmperors.includes(currentEnemyType.name)) {
      defeatedEmperors.push(currentEnemyType.name);
      updateTrophyUI();
    }

    // Spawn a new random enemy with unique visuals
    const newEnemy = getRandomEnemyType();
    renderEnemy(newEnemy);

    showFeedback("🏆 Cesare sconfitto! Sotto con il prossimo!");
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

    const solHtml = activeWord ? `<br><span class="correct-solution">La soluzione era: <strong>${activeWord.italian}</strong></span>` : '';
    if (isTimeout) {
      showFeedback(`⏱️ Tempo scaduto! ${solHtml}<br>Subisci ${damage} danni!`);
    } else {
      showFeedback(`❌ Risposta errata! ${solHtml}<br>Subisci ${damage} danni!`);
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
  defeatedEmperors = [];
  updateTrophyUI();

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
  defeatedEmperors = [];
  updateTrophyUI();

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
