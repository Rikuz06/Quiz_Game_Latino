const puppeteer = require('puppeteer');
const path = require('path');

const localVocab = {
  // Level 1: Basic recognisable nouns (0-5 pt)
  "lupus": "lupo",
  "pater": "padre",
  "mater": "madre",
  "frater": "fratello",
  "soror": "sorella",
  "amicus": "amico",
  "domus": "casa",
  "equus": "cavallo",
  "rosa": "rosa",
  "aqua": "acqua",
  "terra": "terra",
  "silva": "foresta",
  "via": "strada",
  "porta": "porta",
  "servus": "servo",
  "dominus": "signore",
  "filius": "figlio",
  "filia": "figlia",
  "bellum": "guerra",
  "oppidum": "città",
  "templum": "tempio",
  "donum": "dono",
  
  // Level 2: Common verbs and adjectives (6-15 pt)
  "amare": "amare",
  "videre": "vedere",
  "audire": "sentire",
  "legere": "leggere",
  "scribere": "scrivere",
  "currere": "correre",
  "bonus": "buono",
  "malus": "cattivo",
  "magnus": "grande",
  "parvus": "piccolo",
  "novus": "nuovo",
  "vetus": "vecchio",
  "altus": "alto",
  "pulcher": "bello",
  "multi": "molti",
  "clamare": "gridare",
  "pugnare": "combattere",
  "vincere": "vincere",
  "regere": "governare",
  "habitare": "abitare",

  // Level 3: Complex third-declension words (16-30 pt)
  "civitas": "cittadinanza",
  "libertas": "libertà",
  "veritas": "verità",
  "hostis": "nemico",
  "miles": "soldato",
  "rex": "re",
  "dux": "comandante",
  "corpus": "corpo",
  "tempus": "tempo",
  "nomen": "nome",
  "amor": "amore",
  "virtus": "virtù",
  "pax": "pace",
  "lux": "luce",
  "vox": "voce",
  "labor": "lavoro",
  "mons": "montagna",
  "pons": "ponte",
  "urbs": "città",
  "gens": "popolo",
  "mens": "mente",

  // Level 4: Abstract nouns and irregular verbs (31-50 pt)
  "esse": "essere",
  "posse": "potere",
  "velle": "volere",
  "nolle": "non volere",
  "ferre": "portare",
  "ire": "andare",
  "fieri": "accadere",
  "ratio": "ragione",
  "sapientia": "saggezza",
  "audacia": "audacia",
  "clementia": "clemenza",
  "superbia": "superbia",
  "fortuna": "fortuna",
  "fatum": "destino",
  "invidia": "invidia",
  "iustitia": "giustizia",
  "dolor": "dolore",
  "spes": "speranza",
  "fides": "fede",
  "metus": "paura",

  // Level 5: Philosophical concepts (51+ pt)
  "humanitas": "umanità",
  "existenta": "esistenza",
  "essentia": "essenza",
  "cogitatio": "pensiero",
  "aeternitas": "eternità",
  "infinitum": "infinito",
  "beatitudo": "felicità",
  "bonum": "bene",
  "conscientia": "coscienza",
  "transendentia": "trascendenza",
  "dualitas": "dualità",
  "dialectica": "dialettica",
  "metaphysica": "metafisica",
  "ethica": "etica",
  "logica": "logica",
  "cosmos": "cosmo",
  "chaos": "caos",
  "natura": "natura",
  "anima": "anima",
  "intellectus": "intelletto"
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getWord(page) {
  return await page.$eval('#latin-word', el => el.textContent.trim());
}

async function solveActiveWord(page, correct = true) {
  const word = await getWord(page);
  let answer = "incorrect_translation_xyz";
  if (correct) {
    const cleaned = word.toLowerCase().trim();
    const regexStr = '^' + cleaned.replace(/_/g, '.') + '$';
    const regex = new RegExp(regexStr);
    for (const [latin, italian] of Object.entries(localVocab)) {
      if (regex.test(latin)) {
        answer = italian;
        break;
      }
    }
  }
  await page.click('#input-answer', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('#input-answer', answer);
  await page.click('#btn-submit');
}

async function triggerAbility(page, abilityName, method = 'click') {
  const name = abilityName.toLowerCase();
  if (method === 'click') {
    await page.click(`#btn-ability-${name}`);
  } else {
    let key;
    if (name === 'scutum') key = method === 'hotkey_num' ? '1' : 's';
    else if (name === 'oracolo') key = method === 'hotkey_num' ? '2' : 'o';
    else if (name === 'gladius') key = method === 'hotkey_num' ? '3' : 'g';
    if (key) {
      await page.keyboard.press(key);
    }
  }
}

async function getHP(page) {
  const val = await page.$eval('#player-hp', el => el.textContent.trim());
  return parseInt(val, 10);
}

async function getEnemyHP(page) {
  const val = await page.$eval('#enemy-hp', el => el.textContent.trim());
  return parseInt(val, 10);
}

async function getScore(page) {
  const val = await page.$eval('#player-score', el => el.textContent.trim());
  return parseInt(val, 10);
}

async function getStreak(page) {
  const val = await page.$eval('#player-streak', el => el.textContent.trim());
  return parseInt(val, 10);
}

async function getLevel(page) {
  return await page.$eval('#level-display', el => el.textContent.trim());
}

async function getAudioState(page) {
  return await page.$eval('body', el => el.getAttribute('data-audio-state'));
}

async function getAudioLastPlayed(page) {
  return await page.$eval('body', el => el.getAttribute('data-audio-last-played'));
}

async function getFavor(page) {
  const text = await page.$eval('#player-favor-text', el => el.textContent.trim());
  return parseInt(text.replace('%', ''), 10);
}

async function isVisible(page, selector) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && !el.classList.contains('hidden');
  }, selector);
}

describe("Gladiator Arena E2E Test Suite", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    const htmlPath = path.resolve(__dirname, '../index.html');
    await page.goto(`file://${htmlPath}`);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  // ==========================================
  // TIER 1: HAPPY-PATH CASES (30 CASES)
  // ==========================================

  describe("Tier 1: Happy-Path Cases", () => {

    describe("Feature 1: Game State Management", () => {
      test("TC-1.1.1: Start to Battle Screen Transition", async () => {
        expect(await isVisible(page, '#start-screen')).toBe(true);
        expect(await isVisible(page, '#battle-screen')).toBe(false);
        await page.click('#btn-start');
        expect(await isVisible(page, '#start-screen')).toBe(false);
        expect(await isVisible(page, '#battle-screen')).toBe(true);
        expect(await getWord(page)).toBeTruthy();
      });

      test("TC-1.1.2: Battle to Game Over Transition", async () => {
        await page.click('#btn-start');
        let playerHP = await getHP(page);
        while (playerHP > 0) {
          await solveActiveWord(page, false);
          playerHP = await getHP(page);
        }
        expect(playerHP).toBe(0);
        expect(await isVisible(page, '#battle-screen')).toBe(false);
        expect(await isVisible(page, '#game-over-screen')).toBe(true);
      });

      test("TC-1.1.3: Restart Game Transition", async () => {
        await page.click('#btn-start');
        let playerHP = await getHP(page);
        while (playerHP > 0) {
          await solveActiveWord(page, false);
          playerHP = await getHP(page);
        }
        await page.click('#btn-restart');
        expect(await isVisible(page, '#game-over-screen')).toBe(false);
        expect(await isVisible(page, '#battle-screen')).toBe(true);
        expect(await getHP(page)).toBe(100);
        expect(await getScore(page)).toBe(0);
        expect(await getStreak(page)).toBe(0);
      });

      test("TC-1.1.4: Initial Screen State on Load", async () => {
        expect(await isVisible(page, '#start-screen')).toBe(true);
        expect(await isVisible(page, '#battle-screen')).toBe(false);
        expect(await isVisible(page, '#game-over-screen')).toBe(false);
      });

      test("TC-1.1.5: Visual Reset on Fresh Game", async () => {
        await page.click('#btn-start');
        // Build favor to 30% and trigger Oracolo to show clue
        for (let i = 0; i < 3; i++) {
          await solveActiveWord(page, true);
        }
        await triggerAbility(page, 'oracolo');
        expect(await page.$eval('#clue-display', el => el.textContent.trim())).toBeTruthy();

        // Kill player
        let hp = await getHP(page);
        while (hp > 0) {
          await solveActiveWord(page, false);
          hp = await getHP(page);
        }
        await page.click('#btn-restart');

        // Verify visual reset
        expect(await page.$eval('#clue-display', el => el.textContent.trim())).toBe('');
        expect(await isVisible(page, '#status-scutum-active')).toBe(false);
        expect(await isVisible(page, '#modifier-tempus')).toBe(false);
        expect(await isVisible(page, '#modifier-caecus')).toBe(false);
        expect(await isVisible(page, '#modifier-double-damage')).toBe(false);
      });
    });

    describe("Feature 2: Combat & HP Loop", () => {
      test("TC-1.2.1: Correct Answer Scoring and Damage", async () => {
        await page.click('#btn-start');
        const initialEnemyHP = await getEnemyHP(page);
        await solveActiveWord(page, true);
        expect(await getScore(page)).toBe(1);
        expect(await getEnemyHP(page)).toBeLessThan(initialEnemyHP);
      });

      test("TC-1.2.2: Incorrect Answer Player Damage", async () => {
        await page.click('#btn-start');
        const initialHP = await getHP(page);
        await solveActiveWord(page, false);
        expect(await getHP(page)).toBeLessThan(initialHP);
        expect(await getStreak(page)).toBe(0);
      });

      test("TC-1.2.3: Streak Counter Accumulation", async () => {
        await page.click('#btn-start');
        await solveActiveWord(page, true);
        await solveActiveWord(page, true);
        expect(await getStreak(page)).toBe(2);
      });

      test("TC-1.2.4: HP Bar Visual Sync", async () => {
        await page.click('#btn-start');
        const initialWidth = await page.$eval('.player-hp-fill', el => el.style.width);
        await solveActiveWord(page, false);
        const finalWidth = await page.$eval('.player-hp-fill', el => el.style.width);
        expect(parseFloat(finalWidth)).toBeLessThan(parseFloat(initialWidth));
      });

      test("TC-1.2.5: Game Over Stats Display", async () => {
        await page.click('#btn-start');
        // Solve 3 correctly
        for (let i = 0; i < 3; i++) {
          await solveActiveWord(page, true);
        }
        // Fail until dead
        let hp = await getHP(page);
        while (hp > 0) {
          await solveActiveWord(page, false);
          hp = await getHP(page);
        }
        expect(await page.$eval('#stats-words-defeated', el => el.textContent.trim())).toBe("3");
        expect(await page.$eval('#stats-max-streak', el => el.textContent.trim())).toBe("3");
        expect(await page.$eval('#stats-final-score', el => el.textContent.trim())).toBe("3");
      });
    });

    describe("Feature 3: Dynamic Difficulty Escalation", () => {
      test("TC-1.3.1: Level 1 Word Bounds", async () => {
        await page.click('#btn-start');
        expect(await getLevel(page)).toContain("Level 1");
        for (let i = 0; i < 5; i++) {
          await solveActiveWord(page, true);
          expect(await getLevel(page)).toContain("Level 1");
        }
      });

      test("TC-1.3.2: Level 2 Transition", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 6; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getLevel(page)).toContain("Level 2");
      });

      test("TC-1.3.3: Level 3 Transition", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 16; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getLevel(page)).toContain("Level 3");
      });

      test("TC-1.3.4: Level 4 Transition", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 31; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getLevel(page)).toContain("Level 4");
      });

      test("TC-1.3.5: Level 5 Transition", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 51; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getLevel(page)).toContain("Level 5");
      });
    });

    describe("Feature 4: Active Modifiers", () => {
      test("TC-1.4.1: Tempus Timer Activation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 16; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-tempus')).toBe(true);
        expect(await isVisible(page, '#timer-container')).toBe(true);
      });

      test("TC-1.4.2: Caecus Letter Masking Activation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 31; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-caecus')).toBe(true);
        const word = await getWord(page);
        expect(word.includes('_')).toBe(true);
      });

      test("TC-1.4.3: Double Damage Activation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 46; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-double-damage')).toBe(true);
      });

      test("TC-1.4.4: Tempus Timer Expiration Damage", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 16; i++) {
          await solveActiveWord(page, true);
        }
        const initialHP = await getHP(page);
        // Wait 13 seconds for 12s timer expiration
        await delay(13000);
        expect(await getHP(page)).toBeLessThan(initialHP);
        expect(await getStreak(page)).toBe(0);
      });

      test("TC-1.4.5: Double Damage Penalty Implementation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 46; i++) {
          await solveActiveWord(page, true);
        }
        const initialHP = await getHP(page);
        await solveActiveWord(page, false);
        expect(initialHP - await getHP(page)).toBe(30); // 30 HP damage for Double Damage
      });
    });

    describe("Feature 5: Crowd Favor & Special Abilities", () => {
      test("TC-1.5.1: Crowd Favor Gauge Accumulation", async () => {
        await page.click('#btn-start');
        const initialFavor = await getFavor(page);
        await solveActiveWord(page, true);
        expect(await getFavor(page)).toBeGreaterThan(initialFavor);
      });

      test("TC-1.5.2: Scutum Activation and Cost Deduct", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 4; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeGreaterThanOrEqual(40);
        await triggerAbility(page, 'scutum');
        expect(await getFavor(page)).toBe(favorBefore - 40);
        expect(await isVisible(page, '#status-scutum-active')).toBe(true);
      });

      test("TC-1.5.3: Oracolo Clue Activation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 3; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeGreaterThanOrEqual(30);
        await triggerAbility(page, 'oracolo');
        expect(await getFavor(page)).toBe(favorBefore - 30);
        expect(await page.$eval('#clue-display', el => el.textContent.trim())).toBeTruthy();
      });

      test("TC-1.5.4: Gladius Auto-Defeat Activation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 6; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeGreaterThanOrEqual(60);
        const scoreBefore = await getScore(page);
        await triggerAbility(page, 'gladius');
        expect(await getFavor(page)).toBe(favorBefore - 60);
        expect(await getScore(page)).toBe(scoreBefore + 2);
      });

      test("TC-1.5.5: Scutum Damage Mitigation", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 4; i++) {
          await solveActiveWord(page, true);
        }
        await triggerAbility(page, 'scutum');
        const hpBefore = await getHP(page);
        await solveActiveWord(page, false);
        expect(await getHP(page)).toBe(hpBefore);
        expect(await isVisible(page, '#status-scutum-active')).toBe(false);
      });
    });

    describe("Feature 6: Web Audio API", () => {
      test("TC-1.6.1: Autoplay Prevention Compliance", async () => {
        expect(await getAudioState(page)).toBe("suspended");
      });

      test("TC-1.6.2: Interactive Audio Initialization", async () => {
        await page.click('#btn-start');
        expect(await getAudioState(page)).toBe("running");
      });

      test("TC-1.6.3: Correct Translation Sound Playback", async () => {
        await page.click('#btn-start');
        await solveActiveWord(page, true);
        expect(await getAudioLastPlayed(page)).toBe("correct");
      });

      test("TC-1.6.4: Incorrect Translation Sound Playback", async () => {
        await page.click('#btn-start');
        await solveActiveWord(page, false);
        expect(await getAudioLastPlayed(page)).toBe("incorrect");
      });

      test("TC-1.6.5: Shield Clang Sound Playback", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 4; i++) {
          await solveActiveWord(page, true);
        }
        await triggerAbility(page, 'scutum');
        expect(await getAudioLastPlayed(page)).toBe("shield");
      });
    });

  });

  // ==========================================
  // TIER 2: BOUNDARY & ERROR CASES (30 CASES)
  // ==========================================

  describe("Tier 2: Boundary & Error Cases", () => {

    describe("Feature 1: Game State Management", () => {
      test("TC-2.1.1: Ignore Submit on Start Screen", async () => {
        expect(await isVisible(page, '#start-screen')).toBe(true);
        // Try submitting answer
        await page.type('#input-answer', 'lupo');
        await page.click('#btn-submit');
        expect(await isVisible(page, '#start-screen')).toBe(true);
        expect(await isVisible(page, '#battle-screen')).toBe(false);
      });

      test("TC-2.1.2: Ignore Submit on Game Over Screen", async () => {
        await page.click('#btn-start');
        let hp = await getHP(page);
        while (hp > 0) {
          await solveActiveWord(page, false);
          hp = await getHP(page);
        }
        expect(await isVisible(page, '#game-over-screen')).toBe(true);
        const finalScore = await page.$eval('#stats-final-score', el => el.textContent.trim());
        // Try submitting answer
        await page.type('#input-answer', 'lupo');
        await page.click('#btn-submit');
        expect(await page.$eval('#stats-final-score', el => el.textContent.trim())).toBe(finalScore);
      });

      test("TC-2.1.3: De-duplicate Rapid Start Clicks", async () => {
        expect(await isVisible(page, '#start-screen')).toBe(true);
        // Rapid clicks
        await Promise.all([
          page.click('#btn-start'),
          page.click('#btn-start'),
          page.click('#btn-start'),
          page.click('#btn-start'),
          page.click('#btn-start')
        ]);
        await delay(500);
        expect(await isVisible(page, '#battle-screen')).toBe(true);
        expect(await getHP(page)).toBe(100);
      });

      test("TC-2.1.4: De-duplicate Rapid Restart Clicks", async () => {
        await page.click('#btn-start');
        let hp = await getHP(page);
        while (hp > 0) {
          await solveActiveWord(page, false);
          hp = await getHP(page);
        }
        await Promise.all([
          page.click('#btn-restart'),
          page.click('#btn-restart'),
          page.click('#btn-restart'),
          page.click('#btn-restart'),
          page.click('#btn-restart')
        ]);
        await delay(500);
        expect(await isVisible(page, '#battle-screen')).toBe(true);
        expect(await getHP(page)).toBe(100);
      });

      test("TC-2.1.5: Page Reload Hard Reset", async () => {
        await page.click('#btn-start');
        await solveActiveWord(page, true);
        await solveActiveWord(page, false);
        await page.reload();
        expect(await isVisible(page, '#start-screen')).toBe(true);
        expect(await isVisible(page, '#battle-screen')).toBe(false);
      });
    });

    describe("Feature 2: Combat & HP Loop", () => {
      test("TC-2.2.1: Lethal Damage Cap", async () => {
        await page.click('#btn-start');
        // Let HP reach 10 by answering wrong (standard damage is 15)
        // Wait, standard HP = 100. 100 - 15*6 = 10.
        for (let i = 0; i < 6; i++) {
          await solveActiveWord(page, false);
        }
        expect(await getHP(page)).toBe(10);
        // Deal 15 damage
        await solveActiveWord(page, false);
        expect(await getHP(page)).toBe(0);
        expect(await isVisible(page, '#game-over-screen')).toBe(true);
      });

      test("TC-2.2.2: Empty Input Submission", async () => {
        await page.click('#btn-start');
        const hpBefore = await getHP(page);
        await page.click('#input-answer', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#input-answer', '   ');
        await page.click('#btn-submit');
        expect(await getHP(page)).toBe(hpBefore - 15);
        expect(await getStreak(page)).toBe(0);
      });

      test("TC-2.2.3: Input Sanitization (Spaces & Case)", async () => {
        await page.click('#btn-start');
        const word = await getWord(page);
        const translation = localVocab[word.toLowerCase().trim()];
        const dirtyTranslation = `   ${translation.toUpperCase()}   `;
        
        await page.click('#input-answer', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('#input-answer', dirtyTranslation);
        await page.click('#btn-submit');
        
        expect(await getScore(page)).toBe(1);
        expect(await getHP(page)).toBe(100);
      });

      test("TC-2.2.4: Submit Button Double-Click Protection", async () => {
        await page.click('#btn-start');
        await solveActiveWord(page, true);
        // Double click submit button quickly
        await Promise.all([
          page.click('#btn-submit'),
          page.click('#btn-submit')
        ]);
        await delay(100);
        expect(await getScore(page)).toBe(1); // Should only count first submit or wait for new word
      });

      test("TC-2.2.5: HP Capped at Maximum (100)", async () => {
        await page.click('#btn-start');
        expect(await getHP(page)).toBe(100);
        await solveActiveWord(page, true);
        expect(await getHP(page)).toBe(100);
      });
    });

    describe("Feature 3: Dynamic Difficulty Escalation", () => {
      test("TC-2.3.1: Level 1 Upper Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 5; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getScore(page)).toBe(5);
        expect(await getLevel(page)).toContain("Level 1");
      });

      test("TC-2.3.2: Level 2 Lower Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 6; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getScore(page)).toBe(6);
        expect(await getLevel(page)).toContain("Level 2");
      });

      test("TC-2.3.3: Level 2 Upper Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 15; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getScore(page)).toBe(15);
        expect(await getLevel(page)).toContain("Level 2");
      });

      test("TC-2.3.4: Level 3 Upper Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 30; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getScore(page)).toBe(30);
        expect(await getLevel(page)).toContain("Level 3");
      });

      test("TC-2.3.5: Level 4 Upper Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 50; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getScore(page)).toBe(50);
        expect(await getLevel(page)).toContain("Level 4");
      });
    });

    describe("Feature 4: Active Modifiers", () => {
      test("TC-2.4.1: Tempus Activation Score Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 15; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-tempus')).toBe(false);
        await solveActiveWord(page, true);
        expect(await isVisible(page, '#modifier-tempus')).toBe(true);
      });

      test("TC-2.4.2: Caecus Activation Score Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 30; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-caecus')).toBe(false);
        await solveActiveWord(page, true);
        expect(await isVisible(page, '#modifier-caecus')).toBe(true);
      });

      test("TC-2.4.3: Double Damage Score Boundary", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 45; i++) {
          await solveActiveWord(page, true);
        }
        expect(await isVisible(page, '#modifier-double-damage')).toBe(false);
        await solveActiveWord(page, true);
        expect(await isVisible(page, '#modifier-double-damage')).toBe(true);
      });

      test("TC-2.4.4: Tempus Reset on Correct Answer", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 16; i++) {
          await solveActiveWord(page, true);
        }
        // Let timer tick down
        await delay(3000);
        const timeBefore = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
        expect(timeBefore).toBeLessThan(12.0);
        await solveActiveWord(page, true);
        const timeAfter = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
        expect(timeAfter).toBeCloseTo(12.0, 0);
      });

      test("TC-2.4.5: Tempus Duration Minimum Limit", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 50; i++) {
          await solveActiveWord(page, true);
        }
        const timeStartL4 = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
        expect(timeStartL4).toBeCloseTo(8.0, 0);

        for (let i = 0; i < 10; i++) {
          await solveActiveWord(page, true);
        }
        const timeStartL5 = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
        expect(timeStartL5).toBeCloseTo(8.0, 0); // Still 8s minimum
      });
    });

    describe("Feature 5: Crowd Favor & Special Abilities", () => {
      test("TC-2.5.1: Block Scutum below 40% Favor", async () => {
        await page.click('#btn-start');
        // 3 correct answers give < 40% favor (usually 10% per answer)
        for (let i = 0; i < 3; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeLessThan(40);
        await triggerAbility(page, 'scutum');
        expect(await getFavor(page)).toBe(favorBefore);
        expect(await isVisible(page, '#status-scutum-active')).toBe(false);
      });

      test("TC-2.5.2: Block Oracolo below 30% Favor", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 2; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeLessThan(30);
        await triggerAbility(page, 'oracolo');
        expect(await getFavor(page)).toBe(favorBefore);
        expect(await page.$eval('#clue-display', el => el.textContent.trim())).toBe('');
      });

      test("TC-2.5.3: Block Gladius below 60% Favor", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 5; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page);
        expect(favorBefore).toBeLessThan(60);
        const scoreBefore = await getScore(page);
        await triggerAbility(page, 'gladius');
        expect(await getFavor(page)).toBe(favorBefore);
        expect(await getScore(page)).toBe(scoreBefore);
      });

      test("TC-2.5.4: Crowd Favor Cap at 100%", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 15; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getFavor(page)).toBe(100);
        await solveActiveWord(page, true);
        expect(await getFavor(page)).toBe(100);
      });

      test("TC-2.5.5: No Stack on Consecutive Shield Activations", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 9; i++) {
          await solveActiveWord(page, true);
        }
        const favorBefore = await getFavor(page); // around 90%
        await triggerAbility(page, 'scutum');
        expect(await getFavor(page)).toBe(favorBefore - 40);
        const favorAfter = await getFavor(page);
        await triggerAbility(page, 'scutum');
        expect(await getFavor(page)).toBe(favorAfter); // Blocked, same favor
      });
    });

    describe("Feature 6: Web Audio API", () => {
      test("TC-2.6.1: Gladius Sound Event", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 6; i++) {
          await solveActiveWord(page, true);
        }
        await triggerAbility(page, 'gladius');
        expect(await getAudioLastPlayed(page)).toBe("gladius");
      });

      test("TC-2.6.2: Crowd Cheer Sound Event", async () => {
        await page.click('#btn-start');
        for (let i = 0; i < 5; i++) {
          await solveActiveWord(page, true);
        }
        expect(await getAudioLastPlayed(page)).toBe("cheer");
      });

      test("TC-2.6.3: AudioContext Exception Fallback", async () => {
        // Mock AudioContext to throw error
        await page.evaluateOnNewDocument(() => {
          window.AudioContext = class {
            constructor() {
              throw new Error("Mocked audio initialization exception");
            }
          };
          window.webkitAudioContext = window.AudioContext;
        });
        await page.reload();
        await page.click('#btn-start');
        expect(await getAudioState(page)).toBe("error");
        expect(await getWord(page)).toBeTruthy(); // Game works normally
      });

      test("TC-2.6.4: AudioContext Reuse on Restart", async () => {
        await page.click('#btn-start');
        let hp = await getHP(page);
        while (hp > 0) {
          await solveActiveWord(page, false);
          hp = await getHP(page);
        }
        await page.click('#btn-restart');
        expect(await getAudioState(page)).toBe("running");
      });

      test("TC-2.6.5: Rapid Multi-Sound Throttle", async () => {
        await page.click('#btn-start');
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(solveActiveWord(page, i % 2 === 0));
        }
        await Promise.all(promises);
        await delay(500);
        // Ensure no exception crash
        expect(await getHP(page)).toBeGreaterThanOrEqual(0);
      });
    });

  });

  // ==========================================
  // TIER 3: PAIRWISE COMBINATIONS (6 CASES)
  // ==========================================

  describe("Tier 3: Pairwise Combinations", () => {
    
    test("TC-3.1: F1 (Game State) x F4 (Active Modifiers) — Restart Clears Active Modifiers", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 32; i++) {
        await solveActiveWord(page, true);
      }
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);
      expect(await isVisible(page, '#modifier-caecus')).toBe(true);

      // Kill player
      let hp = await getHP(page);
      while (hp > 0) {
        await solveActiveWord(page, false);
        hp = await getHP(page);
      }
      await page.click('#btn-restart');

      expect(await isVisible(page, '#modifier-tempus')).toBe(false);
      expect(await isVisible(page, '#modifier-caecus')).toBe(false);
      expect((await getWord(page)).includes('_')).toBe(false);
    });

    test("TC-3.2: F2 (Combat Loop) x F5 (Crowd Favor) — Scutum Protects HP but Resets Streak", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 5; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getStreak(page)).toBe(5);
      await triggerAbility(page, 'scutum');
      
      const hpBefore = await getHP(page);
      await solveActiveWord(page, false);

      expect(await getHP(page)).toBe(hpBefore);
      expect(await getStreak(page)).toBe(0);
      expect(await isVisible(page, '#status-scutum-active')).toBe(false);
    });

    test("TC-3.3: F3 (Dynamic Difficulty) x F4 (Active Modifiers) — Level Transition Tempus Kickoff", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 15; i++) {
        await solveActiveWord(page, true);
      }
      expect(await isVisible(page, '#modifier-tempus')).toBe(false);
      await solveActiveWord(page, true); // Transitions L2 -> L3 (score = 16)
      expect(await getLevel(page)).toContain("Level 3");
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);
      const timeVal = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
      expect(timeVal).toBeCloseTo(12.0, 0);
    });

    test("TC-3.4: F4 (Active Modifiers) x F5 (Crowd Favor) — Oracolo Counteracts Caecus", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 31; i++) {
        await solveActiveWord(page, true);
      }
      expect(await isVisible(page, '#modifier-caecus')).toBe(true);
      expect(await getWord(page)).toContain('_');

      // Use Oracolo
      await triggerAbility(page, 'oracolo');
      const clueText = await page.$eval('#clue-display', el => el.textContent.trim());
      expect(clueText).toBeTruthy();
    });

    test("TC-3.5: F5 (Crowd Favor) x F6 (Web Audio API) — Gladius Sound and Point Double Trigger", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 6; i++) {
        await solveActiveWord(page, true);
      }
      const scoreBefore = await getScore(page);
      await triggerAbility(page, 'gladius');
      expect(await getScore(page)).toBe(scoreBefore + 2);
      expect(await getAudioLastPlayed(page)).toBe("gladius");
    });

    test("TC-3.6: F2 (Combat Loop) x F6 (Web Audio API) — Incorrect Answer Damage Sound and Screen Shake", async () => {
      await page.click('#btn-start');
      await solveActiveWord(page, false);
      expect(await getAudioLastPlayed(page)).toBe("incorrect");
      const hasShakeClass = await page.evaluate(() => {
        const arena = document.getElementById('arena-container') || document.body;
        return arena.classList.contains('shake-damage') || arena.classList.contains('shake-active') || arena.classList.contains('shake-damage');
      });
      expect(hasShakeClass).toBe(true);
    });

  });

  // ==========================================
  // TIER 4: REAL-WORLD LIFE WORKLOADS (5 CASES)
  // ==========================================

  describe("Tier 4: Real-World Application-Level Workloads", () => {
    
    test("TC-4.1: 'The Champion's Run' (Perfect Play and Escalation)", async () => {
      await page.click('#btn-start');
      // Step 1: Answering 15 consecutive words correctly
      for (let i = 0; i < 15; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getScore(page)).toBe(15);
      expect(await getHP(page)).toBe(100);

      // Step 2: At score 16, Tempus timer activates. Submit 4 more correct answers quickly.
      await solveActiveWord(page, true);
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);
      
      for (let i = 0; i < 3; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getScore(page)).toBe(19);

      // Step 3: At score 20, Crowd Favor is at 100%. Trigger Gladius.
      await solveActiveWord(page, true);
      expect(await getFavor(page)).toBe(100);
      await triggerAbility(page, 'gladius', 'hotkey_letter'); // Use hotkey 'G'
      
      expect(await getFavor(page)).toBe(40); // 100 - 60
      expect(await getScore(page)).toBe(22); // 20 + 2 points
      expect(await getHP(page)).toBe(100);
      expect(await getAudioLastPlayed(page)).toBe("gladius");
    });

    test("TC-4.2: 'The Clueless Recruit' (Struggle, Oracolo Clue Assist, and Defeat)", async () => {
      await page.click('#btn-start');
      // Step 1: Submit 3 incorrect answers consecutively
      for (let i = 0; i < 3; i++) {
        await solveActiveWord(page, false);
      }
      expect(await getHP(page)).toBe(55); // 100 - 15*3

      // Step 2: Submit 3 correct answers consecutively
      for (let i = 0; i < 3; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getScore(page)).toBe(3);
      expect(await getStreak(page)).toBe(3);
      expect(await getFavor(page)).toBe(30);

      // Step 3: Activate Oracolo
      await triggerAbility(page, 'oracolo');
      expect(await getFavor(page)).toBe(0);
      const clue = await page.$eval('#clue-display', el => el.textContent.trim());
      expect(clue).toBeTruthy();

      // Step 4: Use the clue to type correct answer
      await solveActiveWord(page, true);
      expect(await getScore(page)).toBe(4);

      // Step 5: Transition to score 16
      for (let i = 0; i < 12; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getScore(page)).toBe(16);
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);

      // Step 6: Let Tempus timer expire
      const hpBefore = await getHP(page);
      await delay(13000);
      expect(await getHP(page)).toBe(hpBefore - 15);
      expect(await getStreak(page)).toBe(0);

      // Step 7: Submit incorrect answers until HP is 0
      let hp = await getHP(page);
      while (hp > 0) {
        await solveActiveWord(page, false);
        hp = await getHP(page);
      }
      expect(await isVisible(page, '#game-over-screen')).toBe(true);
    });

    test("TC-4.3: 'The Shielded Survivor' (Defensive Strategy)", async () => {
      await page.click('#btn-start');
      // Step 1: Submit 4 correct answers consecutively to get 40% Favor
      for (let i = 0; i < 4; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getFavor(page)).toBe(40);

      // Step 2: Activate Scutum
      await triggerAbility(page, 'scutum');
      expect(await getFavor(page)).toBe(0);
      expect(await isVisible(page, '#status-scutum-active')).toBe(true);

      // Step 3: Submit incorrect answer
      await solveActiveWord(page, false);
      expect(await getHP(page)).toBe(100);
      expect(await getStreak(page)).toBe(0);
      expect(await isVisible(page, '#status-scutum-active')).toBe(false);

      // Step 4: Submit 4 more correct answers
      for (let i = 0; i < 4; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getFavor(page)).toBe(40);

      // Step 5: Activate Scutum
      await triggerAbility(page, 'scutum');
      expect(await getFavor(page)).toBe(0);
      expect(await isVisible(page, '#status-scutum-active')).toBe(true);

      // Step 6: Submit incorrect answer again
      await solveActiveWord(page, false);
      expect(await getHP(page)).toBe(100);
    });

    test("TC-4.4: 'The Panicked Gladiator' (Timer Pressure Handling)", async () => {
      await page.click('#btn-start');
      for (let i = 0; i < 16; i++) {
        await solveActiveWord(page, true);
      }
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);

      // Word 1: Wait until timer is at 1 second, then submit correct answer.
      await delay(10000); // Wait 10s of 12s
      let countdown = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
      expect(countdown).toBeLessThanOrEqual(2.0);
      await solveActiveWord(page, true);

      // Word 2: Wait until timer is at 1 second, then submit correct answer.
      await delay(10000);
      countdown = parseFloat(await page.$eval('#timer-countdown', el => el.textContent));
      expect(countdown).toBeLessThanOrEqual(2.0);
      await solveActiveWord(page, true);

      // Word 3: Let the timer expire.
      const hpBefore = await getHP(page);
      await delay(13000);
      expect(await getHP(page)).toBe(hpBefore - 15);

      // Word 4: Submit correct answer immediately.
      const scoreBefore = await getScore(page);
      await solveActiveWord(page, true);
      expect(await getScore(page)).toBe(scoreBefore + 1);
    });

    test("TC-4.5: 'The Ultimate Comeback' (Full Game Lifecycle)", async () => {
      await page.click('#btn-start');
      // Step 1: Reach score 35
      for (let i = 0; i < 35; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getLevel(page)).toContain("Level 4");
      expect(await isVisible(page, '#modifier-tempus')).toBe(true);
      expect(await isVisible(page, '#modifier-caecus')).toBe(true);

      // Step 2: Take damage from wrong answers until HP is exactly 10
      // Since score > 45 double damage is inactive (score = 35), each wrong answer deals 15 damage.
      // Wait, 100 - 15 * 6 = 10 HP.
      for (let i = 0; i < 6; i++) {
        await solveActiveWord(page, false);
      }
      expect(await getHP(page)).toBe(10);

      // Step 3: Use Oracolo
      await triggerAbility(page, 'oracolo');
      expect(await page.$eval('#clue-display', el => el.textContent.trim())).toBeTruthy();

      // Step 4: Answer correctly. Build streak to 60% Crowd Favor
      await solveActiveWord(page, true);
      for (let i = 0; i < 5; i++) {
        await solveActiveWord(page, true);
      }
      expect(await getFavor(page)).toBeGreaterThanOrEqual(60);

      // Step 5: Activate Gladius
      const scoreBefore = await getScore(page);
      await triggerAbility(page, 'gladius');
      expect(await getScore(page)).toBe(scoreBefore + 2);

      // Step 6: Take lethal damage
      let hp = await getHP(page);
      while (hp > 0) {
        await solveActiveWord(page, false);
        hp = await getHP(page);
      }
      expect(await isVisible(page, '#game-over-screen')).toBe(true);

      // Step 7: Restart
      await page.click('#btn-restart');
      expect(await isVisible(page, '#battle-screen')).toBe(true);
      expect(await getHP(page)).toBe(100);
      expect(await getScore(page)).toBe(0);
    });

  });

});
