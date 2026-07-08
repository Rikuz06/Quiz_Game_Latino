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
    if (bannerTitle) bannerTitle.textContent = `${emperorName} SCONFITTO!`;
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

  const btnMedicina = document.getElementById('btn-ability-medicina');
  if (btnMedicina) {
    if (favor >= 50) {
      btnMedicina.classList.remove('locked');
      btnMedicina.setAttribute('aria-disabled', 'false');
    } else {
      btnMedicina.classList.add('locked');
      btnMedicina.setAttribute('aria-disabled', 'true');
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
    portrait: "img/augustus.png",
    title: "Il Fondatore dell'Impero"
  },
  {
    name: "NERO",
    color: "#b71c1c",
    accent: "#f44336",
    icon: "emperor-nero",
    portrait: "img/nero.png",
    title: "L'Artista Folle"
  },
  {
    name: "CALIGVLA",
    color: "#4a148c",
    accent: "#ab47bc",
    icon: "emperor-caligula",
    portrait: "img/caligula.png",
    title: "Il Tiranno Stravagante"
  },
  {
    name: "TRAIANVS",
    color: "#0d47a1",
    accent: "#2196f3",
    icon: "emperor-trajan",
    portrait: "img/trajan.png",
    title: "L'Ottimo Principe"
  },
  {
    name: "HADRIANVS",
    color: "#004d40",
    accent: "#26a69a",
    icon: "emperor-hadrian",
    portrait: "img/hadrian.png",
    title: "L'Imperatore Filosofo"
  },
  {
    name: "MARCVS AVRELIVS",
    color: "#3e2723",
    accent: "#8d6e63",
    icon: "emperor-marcus",
    portrait: "img/aurelius.png",
    title: "Il Saggio Stoico"
  },
  {
    name: "CLAVDIVS",
    color: "#e65100",
    accent: "#ff9800",
    icon: "emperor-claudius",
    portrait: "img/claudius.png",
    title: "L'Imperatore Erudito"
  },
  {
    name: "TIBERIVS",
    color: "#37474f",
    accent: "#78909c",
    icon: "emperor-tiberius",
    portrait: "img/tiberius.png",
    title: "L'Imperatore Solitario"
  }
];

let currentEnemyType = ENEMY_TYPES[0];

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

  const portraitEl = document.getElementById('enemy-portrait');
  if (portraitEl) {
    portraitEl.src = enemyType.portrait;
    portraitEl.alt = `Ritratto di ${enemyType.name}`;
  }

  const avatarContainer = document.querySelector('.enemy-avatar-container');
  if (avatarContainer) {
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
  answeredWords += 1; // Sync progress tracker
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

  // Set enemy HP to 0 and trigger defeat
  enemyHP = 0;
  updateEnemyHPUI();

  // Trigger non-blocking victory banner
  showVictoryBanner(currentEnemyType.name);

  // Track defeated emperor
  if (!defeatedEmperors.includes(currentEnemyType.name)) {
    defeatedEmperors.push(currentEnemyType.name);
    updateTrophyUI();
  }

  // Spawn a new random emperor
  const newEnemy = getRandomEnemyType();
  renderEnemy(newEnemy);

  // Reset enemy HP to 100 for the newly spawned enemy
  enemyHP = 100;
  updateEnemyHPUI();

  showFeedback("⚔️ Gladius! Cesare sconfitto istantaneamente!");

  // Progress Loop
  loadNextWord();
}

/**
 * Ability: Activate Medicina (Heal 30 HP)
 */
function useMedicina() {
  if (currentState !== States.BATTLE) return;
  if (favor < 50) return;

  favor -= 50;
  playerHP = Math.min(100, playerHP + 30);

  updateFavorUI();
  updatePlayerHPUI();

  RomanArenaAudio.playShield();

  showFeedback("❤️ Medicina! Hai recuperato 30 HP!");
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

  const btnMedicina = document.getElementById('btn-ability-medicina');
  if (btnMedicina) {
    btnMedicina.addEventListener('click', useMedicina);
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
    } else if (key === '4' || key === 'm') {
      e.preventDefault();
      useMedicina();
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
