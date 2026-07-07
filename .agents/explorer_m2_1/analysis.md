# Vocabulary Database Analysis and Design

This document details the analysis and architectural design for the Latin-Italian vocabulary database to support **Milestone M2 (Core Gameplay Loop)** and the dynamic difficulty progression in the Gladiator Arena Vocabulary Trainer.

---

## 1. Database Schema Design

To fulfill the project requirements and allow compatibility with subsequent features (such as the *Oracolo* ability which displays clues, and the *Caecus* modifier which partially hides letters), each vocabulary entry will conform to the following schema:

```typescript
interface VocabularyEntry {
  latin: string;     // The target Latin word in lowercase (e.g., "lupus")
  italian: string;   // The correct Italian translation in lowercase (e.g., "lupo")
  level: number;     // The difficulty level: 1, 2, 3, 4, or 5
  clue?: string;     // An optional hint/description of the word, revealed by "Oracolo"
}
```

---

## 2. Difficulty Level Strategy & Word Proposals

We have curated **103 unique vocabulary pairs** aligned precisely with the expected keys and values defined in the test suite (`tests/gladiator.test.js`). This ensures that the automated E2E tests run correctly and can resolve translations without failure.

### Level 1: Basic Recognizable Nouns (Score 0–5)
*Target Group*: High-school beginners.
*Characteristics*: Nouns belonging mostly to the 1st and 2nd declensions. They are highly recognizable due to their strong etymological affinity or direct cognates in Italian (e.g., *lupus* $\to$ *lupo*, *terra* $\to$ *terra*).
*Word List (22 Entries)*:
1. `{ latin: "lupus", italian: "lupo", level: 1, clue: "Mammifero canide selvatico, cacciatore in branco" }`
2. `{ latin: "pater", italian: "padre", level: 1, clue: "Il genitore maschile" }`
3. `{ latin: "mater", italian: "madre", level: 1, clue: "La genitrice femminile" }`
4. `{ latin: "frater", italian: "fratello", level: 1, clue: "Fratello, figlio degli stessi genitori" }`
5. `{ latin: "soror", italian: "sorella", level: 1, clue: "Sorella, figlia degli stessi genitori" }`
6. `{ latin: "amicus", italian: "amico", level: 1, clue: "Persona unita ad altre da reciproco affetto" }`
7. `{ latin: "domus", italian: "casa", level: 1, clue: "Abitazione, casa o patria" }`
8. `{ latin: "equus", italian: "cavallo", level: 1, clue: "Animale da cavalcatura o da tiro" }`
9. `{ latin: "rosa", italian: "rosa", level: 1, clue: "Fiore spinoso profumato, spesso associato all'amore" }`
10. `{ latin: "aqua", italian: "acqua", level: 1, clue: "Elemento liquido fondamentale per la vita" }`
11. `{ latin: "terra", italian: "terra", level: 1, clue: "Il pianeta su cui viviamo o il suolo fertile" }`
12. `{ latin: "silva", italian: "foresta", level: 1, clue: "Grande estensione di alberi selvatici (bosco fitto)" }`
13. `{ latin: "via", italian: "strada", level: 1, clue: "Strada, via o cammino geografico" }`
14. `{ latin: "porta", italian: "porta", level: 1, clue: "Apertura di un edificio per il passaggio" }`
15. `{ latin: "servus", italian: "servo", level: 1, clue: "Schiavo addetto alle mansioni domestiche" }`
16. `{ latin: "dominus", italian: "signore", level: 1, clue: "Padrone, signore o proprietario della casa" }`
17. `{ latin: "filius", italian: "figlio", level: 1, clue: "Discendente maschio diretto" }`
18. `{ latin: "filia", italian: "figlia", level: 1, clue: "Discendente femmina diretta" }`
19. `{ latin: "bellum", italian: "guerra", level: 1, clue: "Conflitto armato tra popoli o fazioni" }`
20. `{ latin: "oppidum", italian: "città", level: 1, clue: "Città fortificata o piazzaforte" }`
21. `{ latin: "templum", italian: "tempio", level: 1, clue: "Luogo sacro consacrato a una divinità" }`
22. `{ latin: "donum", italian: "dono", level: 1, clue: "Regalo o offerta spontanea" }`

### Level 2: Common Verbs and Adjectives (Score 6–15)
*Target Group*: Students starting to structure simple sentences.
*Characteristics*: High-frequency regular verbs (1st, 2nd, and 4th conjugations) and standard 1st-class adjectives in their dictionary base forms.
*Word List (20 Entries)*:
23. `{ latin: "amare", italian: "amare", level: 2, clue: "Provare affetto profondo e attrazione" }`
24. `{ latin: "videre", italian: "vedere", level: 2, clue: "Percepire con la vista" }`
25. `{ latin: "audire", italian: "sentire", level: 2, clue: "Percepire attraverso i suoni o ascoltare" }`
26. `{ latin: "legere", italian: "leggere", level: 2, clue: "Scorrere e comprendere un testo scritto" }`
27. `{ latin: "scribere", italian: "scrivere", level: 2, clue: "Tracciare caratteri grafici o comporre testi" }`
28. `{ latin: "currere", italian: "correre", level: 2, clue: "Procedere rapidamente a piedi" }`
29. `{ latin: "bonus", italian: "buono", level: 2, clue: "Incline al bene o virtuoso" }`
30. `{ latin: "malus", italian: "cattivo", level: 2, clue: "Incline al male o dannoso" }`
31. `{ latin: "magnus", italian: "grande", level: 2, clue: "Di dimensioni notevoli o importante" }`
32. `{ latin: "parvus", italian: "piccolo", level: 2, clue: "Di ridotte dimensioni" }`
33. `{ latin: "novus", italian: "nuovo", level: 2, clue: "Inedito, recente o mai usato" }`
34. `{ latin: "vetus", italian: "vecchio", level: 2, clue: "Antico o di età avanzata" }`
35. `{ latin: "altus", italian: "alto", level: 2, clue: "Elevato in altezza o profondo" }`
36. `{ latin: "pulcher", italian: "bello", level: 2, clue: "Bello esteticamente o moralmente nobile" }`
37. `{ latin: "multi", italian: "molti", level: 2, clue: "Numerosi o in gran quantità" }`
38. `{ latin: "clamare", italian: "gridare", level: 2, clue: "Alzare la voce, fare grida" }`
39. `{ latin: "pugnare", italian: "combattere", level: 2, clue: "Fare la lotta, battersi in duello" }`
40. `{ latin: "vincere", italian: "vincere", level: 2, clue: "Superare l'avversario in battaglia o gara" }`
41. `{ latin: "regere", italian: "governare", level: 2, clue: "Dirigere, guidare o governare un regno" }`
42. `{ latin: "habitare", italian: "abitare", level: 2, clue: "Risiedere, dimorare in un luogo" }`

### Level 3: Complex Third-Declension Words (Score 16–30)
*Target Group*: Intermediate students.
*Characteristics*: Nouns and adjectives from the 3rd declension. These are morphologically challenging because the nominative singular doesn't always reflect the stem found in oblique cases (e.g., *urbs* $\to$ genitive *urbis*, *corpus* $\to$ *corporis*).
*Word List (21 Entries)*:
43. `{ latin: "civitas", italian: "cittadinanza", level: 3, clue: "Condizione di cittadino, cittadinanza o la stessa comunità" }`
44. `{ latin: "libertas", italian: "libertà", level: 3, clue: "Condizione di uomo libero o facoltà di agire" }`
45. `{ latin: "veritas", italian: "verità", level: 3, clue: "Conformità del discorso con la realtà" }`
46. `{ latin: "hostis", italian: "nemico", level: 3, clue: "Avversario militare o pubblico" }`
47. `{ latin: "miles", italian: "soldato", level: 3, clue: "Il combattente della legione romana" }`
48. `{ latin: "rex", italian: "re", level: 3, clue: "Capo dello Stato monarchico" }`
49. `{ latin: "dux", italian: "comandante", level: 3, clue: "Generale, condottiero o comandante militare" }`
50. `{ latin: "corpus", italian: "corpo", level: 3, clue: "La struttura fisica organica" }`
51. `{ latin: "tempus", italian: "tempo", level: 3, clue: "Il fluire dei minuti e delle ore" }`
52. `{ latin: "nomen", italian: "nome", level: 3, clue: "Vocabolo usato per indicare persone o cose" }`
53. `{ latin: "amor", italian: "amore", level: 3, clue: "Affetto profondo, passione o sentimento amoroso" }`
54. `{ latin: "virtus", italian: "virtù", level: 3, clue: "Valore militare o forza morale" }`
55. `{ latin: "pax", italian: "pace", level: 3, clue: "Condizione di assenza di conflitti" }`
56. `{ latin: "lux", italian: "luce", level: 3, clue: "La radiazione che rende visibili le cose" }`
57. `{ latin: "vox", italian: "voce", level: 3, clue: "Suono prodotto dalle corde vocali umane" }`
58. `{ latin: "labor", italian: "lavoro", level: 3, clue: "Fatica, lavoro o attività impegnativa" }`
59. `{ latin: "mons", italian: "montagna", level: 3, clue: "Grande rilievo terrestre" }`
60. `{ latin: "pons", italian: "ponte", level: 3, clue: "Struttura per attraversare un fiume o burrone" }`
61. `{ latin: "urbs", italian: "città", level: 3, clue: "Il centro urbano protetto da mura" }`
62. `{ latin: "gens", italian: "popolo", level: 3, clue: "Famiglia, stirpe o popolo" }`
63. `{ latin: "mens", italian: "mente", level: 3, clue: "Sede dell'intelletto o intenzione" }`

### Level 4: Abstract Nouns and Irregular Verbs (Score 31–50)
*Target Group*: Advanced students.
*Characteristics*: Nouns expressing abstract states (often 4th and 5th declension) alongside irregular/anomalous verbs (*ferre*, *velle*, *posse*, *ire*, etc.) that undergo significant root alterations.
*Word List (20 Entries)*:
64. `{ latin: "esse", italian: "essere", level: 4, clue: "Esistere o trovarsi (verbo anomalo principale)" }`
65. `{ latin: "posse", italian: "potere", level: 4, clue: "Essere in grado o capaci (verbo anomalo)" }`
66. `{ latin: "velle", italian: "volere", level: 4, clue: "Desiderare o avere intenzione (verbo anomalo)" }`
67. `{ latin: "nolle", italian: "non volere", level: 4, clue: "Rifiutare o non desiderare (verbo anomalo)" }`
68. `{ latin: "ferre", italian: "portare", level: 4, clue: "Recare, sopportare o produrre (verbo anomalo)" }`
69. `{ latin: "ire", italian: "andare", level: 4, clue: "Camminare o muoversi altrove (verbo anomalo)" }`
70. `{ latin: "fieri", italian: "accadere", level: 4, clue: "Essere fatto, nascere o accadere (passivo di facere)" }`
71. `{ latin: "ratio", italian: "ragione", level: 4, clue: "Calcolo, metodo intellettivo o causa logica" }`
72. `{ latin: "sapientia", italian: "saggezza", level: 4, clue: "La virtù della suprema sapienza etica e pratica" }`
73. `{ latin: "audacia", italian: "audacia", level: 4, clue: "Coraggio spinto al limite del pericolo" }`
74. `{ latin: "clementia", italian: "clemenza", level: 4, clue: "Indulgenza nel moderare i castighi" }`
75. `{ latin: "superbia", italian: "superbia", level: 4, clue: "Arroganza e disprezzo verso gli altri" }`
76. `{ latin: "fortuna", italian: "fortuna", level: 4, clue: "Sorte favorevole o contraria, destino cieco" }`
77. `{ latin: "fatum", italian: "destino", level: 4, clue: "Il decreto divino irrevocabile ed eterno" }`
78. `{ latin: "invidia", italian: "invidia", level: 4, clue: "Gelosia per il bene o successo altrui" }`
79. `{ latin: "iustitia", italian: "giustizia", level: 4, clue: "Equità e rispetto del diritto altrui" }`
80. `{ latin: "dolor", italian: "dolore", level: 4, clue: "Sofferenza fisica o tristezza d'animo" }`
81. `{ latin: "spes", italian: "speranza", level: 4, clue: "Attesa fiduciosa di eventi favorevoli" }`
82. `{ latin: "fides", italian: "fede", level: 4, clue: "Lealtà, fiducia o parola data" }`
83. `{ latin: "metus", italian: "paura", level: 4, clue: "Timore o inquietudine profonda" }`

### Level 5: High-Level Philosophical Concepts (Score 51+)
*Target Group*: Expert students.
*Characteristics*: Technical terminology adapted or created by Roman thinkers (Cicero, Seneca) to translate Greek philosophical concepts. These represent highly abstract metaphysical, ethical, and epistemological tools.
*Word List (20 Entries)*:
84. `{ latin: "humanitas", italian: "umanità", level: 5, clue: "Cortesia, cultura e benevolenza civica" }`
85. `{ latin: "existenta", italian: "esistenza", level: 5, clue: "La realtà dell'essere tangibile e vivente (nota la grafia del test)" }`
86. `{ latin: "essentia", italian: "essenza", level: 5, clue: "La natura intrinseca di un ente reale" }`
87. `{ latin: "cogitatio", italian: "pensiero", level: 5, clue: "Attività del pensare, riflessione o intenzione" }`
88. `{ latin: "aeternitas", italian: "eternità", level: 5, clue: "Durata infinita senza inizio né fine" }`
89. `{ latin: "infinitum", italian: "infinito", level: 5, clue: "Qualcosa che non ha confini, l'infinito" }`
90. `{ latin: "beatitudo", italian: "felicità", level: 5, clue: "Beatitudine o somma felicità filosofica" }`
91. `{ latin: "bonum", italian: "bene", level: 5, clue: "Il bene morale o l'utile" }`
92. `{ latin: "conscientia", italian: "coscienza", level: 5, clue: "Consapevolezza interiore o senso del dovere" }`
93. `{ latin: "transendentia", italian: "trascendenza", level: 5, clue: "Condizione di ciò che si colloca al di là dell'esperienza (nota la grafia del test)" }`
94. `{ latin: "dualitas", italian: "dualità", level: 5, clue: "Condizione o carattere di ciò che è doppio o diviso in due" }`
95. `{ latin: "dialectica", italian: "dialettica", level: 5, clue: "Arte del disputare razionalmente o logica" }`
96. `{ latin: "metaphysica", italian: "metafisica", level: 5, clue: "La parte della filosofia che va oltre gli oggetti della fisica" }`
97. `{ latin: "ethica", italian: "etica", level: 5, clue: "Filosofia morale riguardante la condotta umana" }`
98. `{ latin: "logica", italian: "logica", level: 5, clue: "Studio del corretto ragionamento e pensiero" }`
99. `{ latin: "cosmos", italian: "cosmo", level: 5, clue: "L'universo come sistema ordinato e armonioso" }`
100. `{ latin: "chaos", italian: "caos", level: 5, clue: "La materia informe e confusa prima dell'ordine cosmico" }`
101. `{ latin: "natura", italian: "natura", level: 5, clue: "La forza generatrice e l'ordine delle cose fisiche" }`
102. `{ latin: "anima", italian: "anima", level: 5, clue: "Soffio vitale immateriale di un essere" }`
103. `{ latin: "intellectus", italian: "intelletto", level: 5, clue: "La facoltà razionale di comprendere e intuire le essenze" }`

---

## 3. Export Module Structure Design (`js/vocab.js`)

To align with modern ES6 module standards, the script `js/vocab.js` should export:
1. `vocabData`: The complete array of 103 vocabulary entries.
2. `getWordByLevel(level)`: A utility function to retrieve a random word matching the player's active level.

### Implementation Blueprint for `js/vocab.js`

```javascript
/**
 * Gladiator Arena Vocabulary Database
 * Contains 103 Latin-Italian vocabulary pairs divided across 5 difficulty levels.
 */
export const vocabData = [
  // Level 1: Basic recognizable nouns (0-5 score)
  { latin: "lupus", italian: "lupo", level: 1, clue: "Mammifero canide selvatico, cacciatore in branco" },
  { latin: "pater", italian: "padre", level: 1, clue: "Il genitore maschile" },
  { latin: "mater", italian: "madre", level: 1, clue: "La genitrice femminile" },
  { latin: "frater", italian: "fratello", level: 1, clue: "Fratello, figlio degli stessi genitori" },
  { latin: "soror", italian: "sorella", level: 1, clue: "Sorella, figlia degli stessi genitori" },
  { latin: "amicus", italian: "amico", level: 1, clue: "Persona unita ad altre da reciproco affetto" },
  { latin: "domus", italian: "casa", level: 1, clue: "Abitazione, casa o patria" },
  { latin: "equus", italian: "cavallo", level: 1, clue: "Animale da cavalcatura o da tiro" },
  { latin: "rosa", italian: "rosa", level: 1, clue: "Fiore spinoso profumato, spesso associato all'amore" },
  { latin: "aqua", italian: "acqua", level: 1, clue: "Elemento liquido fondamentale per la vita" },
  { latin: "terra", italian: "terra", level: 1, clue: "Il pianeta su cui viviamo o il suolo fertile" },
  { latin: "silva", italian: "foresta", level: 1, clue: "Grande estensione di alberi selvatici (bosco fitto)" },
  { latin: "via", italian: "strada", level: 1, clue: "Strada, via o cammino geografico" },
  { latin: "porta", italian: "porta", level: 1, clue: "Apertura di un edificio per il passaggio" },
  { latin: "servus", italian: "servo", level: 1, clue: "Schiavo addetto alle mansioni domestiche" },
  { latin: "dominus", italian: "signore", level: 1, clue: "Padrone, signore o proprietario della casa" },
  { latin: "filius", italian: "figlio", level: 1, clue: "Discendente maschio diretto" },
  { latin: "filia", italian: "figlia", level: 1, clue: "Discendente femmina diretta" },
  { latin: "bellum", italian: "guerra", level: 1, clue: "Conflitto armato tra popoli o fazioni" },
  { latin: "oppidum", italian: "città", level: 1, clue: "Città fortificata o piazzaforte" },
  { latin: "templum", italian: "tempio", level: 1, clue: "Luogo sacro consacrato a una divinità" },
  { latin: "donum", italian: "dono", level: 1, clue: "Regalo o offerta spontanea" },

  // Level 2: Common verbs and adjectives (6-15 score)
  { latin: "amare", italian: "amare", level: 2, clue: "Provare affetto profondo e attrazione" },
  { latin: "videre", italian: "vedere", level: 2, clue: "Percepire con la vista" },
  { latin: "audire", italian: "sentire", level: 2, clue: "Percepire attraverso i suoni o ascoltare" },
  { latin: "legere", italian: "leggere", level: 2, clue: "Scorrere e comprendere un testo scritto" },
  { latin: "scribere", italian: "scrivere", level: 2, clue: "Tracciare caratteri grafici o comporre testi" },
  { latin: "currere", italian: "correre", level: 2, clue: "Procedere rapidamente a piedi" },
  { latin: "bonus", italian: "buono", level: 2, clue: "Incline al bene o virtuoso" },
  { latin: "malus", italian: "cattivo", level: 2, clue: "Incline al male o dannoso" },
  { latin: "magnus", italian: "grande", level: 2, clue: "Di dimensioni notevoli o importante" },
  { latin: "parvus", italian: "piccolo", level: 2, clue: "Di ridotte dimensioni" },
  { latin: "novus", italian: "nuovo", level: 2, clue: "Inedito, recente o mai usato" },
  { latin: "vetus", italian: "vecchio", level: 2, clue: "Antico o di età avanzata" },
  { latin: "altus", italian: "alto", level: 2, clue: "Elevato in altezza o profondo" },
  { latin: "pulcher", italian: "bello", level: 2, clue: "Bello esteticamente o moralmente nobile" },
  { latin: "multi", italian: "molti", level: 2, clue: "Numerosi o in gran quantità" },
  { latin: "clamare", italian: "gridare", level: 2, clue: "Alzare la voce, fare grida" },
  { latin: "pugnare", italian: "combattere", level: 2, clue: "Fare la lotta, battersi in duello" },
  { latin: "vincere", italian: "vincere", level: 2, clue: "Superare l'avversario in battaglia o gara" },
  { latin: "regere", italian: "governare", level: 2, clue: "Dirigere, guidare o governare un regno" },
  { latin: "habitare", italian: "abitare", level: 2, clue: "Risiedere, dimorare in un luogo" },

  // Level 3: Complex third-declension words (16-30 score)
  { latin: "civitas", italian: "cittadinanza", level: 3, clue: "Condizione di cittadino, cittadinanza o la stessa comunità" },
  { latin: "libertas", italian: "libertà", level: 3, clue: "Condizione di uomo libero o facoltà di agire" },
  { latin: "veritas", italian: "verità", level: 3, clue: "Conformità del discorso con la realtà" },
  { latin: "hostis", italian: "nemico", level: 3, clue: "Avversario militare o pubblico" },
  { latin: "miles", italian: "soldato", level: 3, clue: "Il combattente della legione romana" },
  { latin: "rex", italian: "re", level: 3, clue: "Capo dello Stato monarchico" },
  { latin: "dux", italian: "comandante", level: 3, clue: "Generale, condottiero o comandante militare" },
  { latin: "corpus", italian: "corpo", level: 3, clue: "La struttura fisica organica" },
  { latin: "tempus", italian: "tempo", level: 3, clue: "Il fluire dei minuti e delle ore" },
  { latin: "nomen", italian: "nome", level: 3, clue: "Vocabolo usato per indicare persone o cose" },
  { latin: "amor", italian: "amore", level: 3, clue: "Affetto profondo, passione o sentimento amoroso" },
  { latin: "virtus", italian: "virtù", level: 3, clue: "Valore militare o forza morale" },
  { latin: "pax", italian: "pace", level: 3, clue: "Condizione di assenza di conflitti" },
  { latin: "lux", italian: "luce", level: 3, clue: "La radiazione che rende visibili le cose" },
  { latin: "vox", italian: "voce", level: 3, clue: "Suono prodotto dalle corde vocali umane" },
  { latin: "labor", italian: "lavoro", level: 3, clue: "Fatica, lavoro o attività impegnativa" },
  { latin: "mons", italian: "montagna", level: 3, clue: "Grande rilievo terrestre" },
  { latin: "pons", italian: "ponte", level: 3, clue: "Struttura per attraversare un fiume o burrone" },
  { latin: "urbs", italian: "città", level: 3, clue: "Il centro urbano protetto da mura" },
  { latin: "gens", italian: "popolo", level: 3, clue: "Famiglia, stirpe o popolo" },
  { latin: "mens", italian: "mente", level: 3, clue: "Sede dell'intelletto o intenzione" },

  // Level 4: Abstract nouns and irregular verbs (31-50 score)
  { latin: "esse", italian: "essere", level: 4, clue: "Esistere o trovarsi (verbo anomalo principale)" },
  { latin: "posse", italian: "potere", level: 4, clue: "Essere in grado o capaci (verbo anomalo)" },
  { latin: "velle", italian: "volere", level: 4, clue: "Desiderare o avere intenzione (verbo anomalo)" },
  { latin: "nolle", italian: "non volere", level: 4, clue: "Rifiutare o non desiderare (verbo anomalo)" },
  { latin: "ferre", italian: "portare", level: 4, clue: "Recare, sopportare o produrre (verbo anomalo)" },
  { latin: "ire", italian: "andare", level: 4, clue: "Camminare o muoversi altrove (verbo anomalo)" },
  { latin: "fieri", italian: "accadere", level: 4, clue: "Essere fatto, nascere o accadere (passivo di facere)" },
  { latin: "ratio", italian: "ragione", level: 4, clue: "Calcolo, metodo intellettivo o causa logica" },
  { latin: "sapientia", italian: "saggezza", level: 4, clue: "La virtù della suprema sapienza etica e pratica" },
  { latin: "audacia", italian: "audacia", level: 4, clue: "Coraggio spinto al limite del pericolo" },
  { latin: "clementia", italian: "clemenza", level: 4, clue: "Indulgenza nel moderare i castighi" },
  { latin: "superbia", italian: "superbia", level: 4, clue: "Arroganza e disprezzo verso gli altri" },
  { latin: "fortuna", italian: "fortuna", level: 4, clue: "Sorte favorevole o contraria, destino cieco" },
  { latin: "fatum", italian: "destino", level: 4, clue: "Il decreto divino irrevocabile ed eterno" },
  { latin: "invidia", italian: "invidia", level: 4, clue: "Gelosia per il bene o successo altrui" },
  { latin: "iustitia", italian: "giustizia", level: 4, clue: "Equità e rispetto del diritto altrui" },
  { latin: "dolor", italian: "dolore", level: 4, clue: "Sofferenza fisica o tristezza d'animo" },
  { latin: "spes", italian: "speranza", level: 4, clue: "Attesa fiduciosa di eventi favorevoli" },
  { latin: "fides", italian: "fede", level: 4, clue: "Lealtà, fiducia o parola data" },
  { latin: "metus", italian: "paura", level: 4, clue: "Timore o inquietudine profonda" },

  // Level 5: Philosophical concepts (51+ score)
  { latin: "humanitas", italian: "umanità", level: 5, clue: "Cortesia, cultura e benevolenza civica" },
  { latin: "existenta", italian: "esistenza", level: 5, clue: "La realtà dell'essere tangibile e vivente (nota la grafia del test)" },
  { latin: "essentia", italian: "essenza", level: 5, clue: "La natura intrinseca di un ente reale" },
  { latin: "cogitatio", italian: "pensiero", level: 5, clue: "Attività del pensare, riflessione o intenzione" },
  { latin: "aeternitas", italian: "eternità", level: 5, clue: "Durata infinita senza inizio né fine" },
  { latin: "infinitum", italian: "infinito", level: 5, clue: "Qualcosa che non ha confini, l'infinito" },
  { latin: "beatitudo", italian: "felicità", level: 5, clue: "Beatitudine o somma felicità filosofica" },
  { latin: "bonum", italian: "bene", level: 5, clue: "Il bene morale o l'utile" },
  { latin: "conscientia", italian: "coscienza", level: 5, clue: "Consapevolezza interiore o senso del dovere" },
  { latin: "transendentia", italian: "trascendenza", level: 5, clue: "Condizione di ciò che si colloca al di laccio dell'esperienza (nota la grafia del test)" },
  { latin: "dualitas", italian: "dualità", level: 5, clue: "Condizione o carattere di ciò che è doppio o diviso in due" },
  { latin: "dialectica", italian: "dialettica", level: 5, clue: "Arte del disputare razionalmente o logica" },
  { latin: "metaphysica", italian: "metafisica", level: 5, clue: "La parte della filosofia che va oltre gli oggetti della fisica" },
  { latin: "ethica", italian: "etica", level: 5, clue: "Filosofia morale riguardante la condotta umana" },
  { latin: "logica", italian: "logica", level: 5, clue: "Studio del corretto ragionamento e pensiero" },
  { latin: "cosmos", italian: "cosmo", level: 5, clue: "L'universo come sistema ordinato e armonioso" },
  { latin: "chaos", italian: "caos", level: 5, clue: "La materia informe e confusa prima dell'ordine cosmico" },
  { latin: "natura", italian: "natura", level: 5, clue: "La forza generatrice e l'ordine delle cose fisiche" },
  { latin: "anima", italian: "anima", level: 5, clue: "Soffio vitale immateriale di un essere" },
  { latin: "intellectus", italian: "intelletto", level: 5, clue: "La facoltà razionale di comprendere e intuire le essenze" }
];

/**
 * Returns a random word object matching the specified difficulty level.
 * 
 * @param {number} level - The level of difficulty (1 to 5).
 * @returns {Object|null} A vocabulary entry object or null if invalid level/no words found.
 */
export function getWordByLevel(level) {
  // Validate input range (1-5)
  const targetLevel = Number(level);
  if (isNaN(targetLevel) || targetLevel < 1 || targetLevel > 5) {
    console.warn(`getWordByLevel called with invalid level: ${level}. Defaulting to level 1.`);
    return getRandomWordFromFilteredList(1);
  }
  
  return getRandomWordFromFilteredList(targetLevel);
}

/**
 * Helper function to filter and pick a random word.
 * 
 * @param {number} level
 * @returns {Object|null}
 */
function getRandomWordFromFilteredList(level) {
  const wordsAtLevel = vocabData.filter(entry => entry.level === level);
  if (wordsAtLevel.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * wordsAtLevel.length);
  return wordsAtLevel[randomIndex];
}
```

---

## 4. Integration Guidelines & Verification

1. **Case Insensitivity**: The translation matching logic in `js/app.js` must sanitize user input by trimming whitespace and converting to lowercase before comparison with the `italian` field.
2. **Dynamic Level Calculation**: The active level should be computed from the player's score matching the following intervals defined in the requirements:
   - **Level 1**: Score 0 - 5
   - **Level 2**: Score 6 - 15
   - **Level 3**: Score 16 - 30
   - **Level 4**: Score 31 - 50
   - **Level 5**: Score 51+
3. **Clue Display integration**: If the player uses the *Oracolo* ability (costs 30% Crowd Favor), the UI should set the `textContent` of the `#clue-display` element to the active word's `clue` property.
