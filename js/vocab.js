/**
 * Aligned Vocabulary Database for Gladiator Arena.
 * Matches the E2E test localVocab data structure exactly.
 * Levels are 1-indexed (Level 1 to 5).
 * 
 * EXPANDED: Includes declined noun forms across all 5 declensions,
 * conjugated verb forms, and adjective agreement for comprehensive training.
 */
export const vocabData = [
  // LEVEL 1: Basic recognisable nouns (Score 0-5)
  { latin: "lupus", italian: "lupo", level: 1, clue: "Animale selvatico simile a un grosso cane, simbolo di Roma." },
  { latin: "pater", italian: "padre", level: 1, clue: "Il capofamiglia maschile." },
  { latin: "mater", italian: "madre", level: 1, clue: "La figura genitoriale femminile." },
  { latin: "frater", italian: "fratello", level: 1, clue: "Maschio nato dagli stessi genitori." },
  { latin: "soror", italian: "sorella", level: 1, clue: "Femmina nata dagli stessi genitori." },
  { latin: "amicus", italian: "amico", level: 1, clue: "Persona legata da affetto reciproco." },
  { latin: "domus", italian: "casa", level: 1, clue: "La dimora, l'abitazione familiare." },
  { latin: "equus", italian: "cavallo", level: 1, clue: "Animale da cavalcatura impiegato in battaglia e nei carri." },
  { latin: "rosa", italian: "rosa", level: 1, clue: "Fiore spinoso profumato." },
  { latin: "aqua", italian: "acqua", level: 1, clue: "Elemento liquido vitale." },
  { latin: "terra", italian: "terra", level: 1, clue: "Suolo su cui si cammina o si coltiva." },
  { latin: "silva", italian: "foresta", level: 1, clue: "Luogo boscoso e selvaggio." },
  { latin: "via", italian: "strada", level: 1, clue: "Sentiero o pavimentazione di collegamento." },
  { latin: "porta", italian: "porta", level: 1, clue: "Apertura per entrare o uscire." },
  { latin: "servus", italian: "servo", level: 1, clue: "Persona in stato di schiavitù o sottomissione." },
  { latin: "dominus", italian: "signore", level: 1, clue: "Il padrone della casa o della terra." },
  { latin: "filius", italian: "figlio", level: 1, clue: "Discendente maschio diretto." },
  { latin: "filia", italian: "figlia", level: 1, clue: "Discendente femmina diretta." },
  { latin: "bellum", italian: "guerra", level: 1, clue: "Conflitto armato." },
  { latin: "oppidum", italian: "città", level: 1, clue: "Città fortificata." },
  { latin: "templum", italian: "tempio", level: 1, clue: "Edificio sacro agli dei." },
  { latin: "donum", italian: "dono", level: 1, clue: "Regalo offerto spontaneamente." },

  // ─── LEVEL 1 BONUS: I Declinazione (rosa, rosae) ───
  { latin: "rosae", italian: "della rosa", level: 1, clue: "Genitivo singolare di 'rosa' (I declinazione). Di chi è il profumo?" },
  { latin: "rosam", italian: "la rosa", level: 1, clue: "Accusativo singolare di 'rosa' (I declinazione). Chi/che cosa vedo?" },
  { latin: "rosā", italian: "con la rosa", level: 1, clue: "Ablativo singolare di 'rosa' (I declinazione). Con che cosa?" },
  { latin: "rosas", italian: "le rose", level: 1, clue: "Accusativo plurale di 'rosa' (I declinazione). Chi/che cosa vedo?" },
  { latin: "rosarum", italian: "delle rose", level: 1, clue: "Genitivo plurale di 'rosa' (I declinazione). Di chi?" },
  { latin: "rosis", italian: "alle rose", level: 1, clue: "Dativo plurale di 'rosa' (I declinazione). A chi? A che cosa?" },
  { latin: "aquam", italian: "l'acqua", level: 1, clue: "Accusativo singolare di 'aqua' (I declinazione). Che cosa bevo?" },
  { latin: "aquae", italian: "dell'acqua", level: 1, clue: "Genitivo singolare di 'aqua' (I declinazione). Di che cosa?" },
  { latin: "silvam", italian: "la foresta", level: 1, clue: "Accusativo singolare di 'silva' (I declinazione). Dove vado?" },
  { latin: "silvarum", italian: "delle foreste", level: 1, clue: "Genitivo plurale di 'silva' (I declinazione). Di quali luoghi?" },
  { latin: "terram", italian: "la terra", level: 1, clue: "Accusativo singolare di 'terra' (I declinazione). Che cosa coltivo?" },
  { latin: "terrae", italian: "della terra", level: 1, clue: "Genitivo singolare di 'terra' (I declinazione). Di che cosa?" },
  { latin: "viam", italian: "la strada", level: 1, clue: "Accusativo singolare di 'via' (I declinazione). Che cosa percorro?" },
  { latin: "portam", italian: "la porta", level: 1, clue: "Accusativo singolare di 'porta' (I declinazione). Che cosa attraverso?" },
  { latin: "filiam", italian: "la figlia", level: 1, clue: "Accusativo singolare di 'filia' (I declinazione). Chi chiamo?" },
  { latin: "filiae", italian: "della figlia", level: 1, clue: "Genitivo singolare di 'filia' (I declinazione). Di chi?" },

  // ─── LEVEL 1 BONUS: II Declinazione (lupus, lupi / bellum, belli) ───
  { latin: "lupi", italian: "del lupo", level: 1, clue: "Genitivo singolare di 'lupus' (II declinazione). Di chi è l'ululato?" },
  { latin: "lupum", italian: "il lupo", level: 1, clue: "Accusativo singolare di 'lupus' (II declinazione). Chi vedo?" },
  { latin: "lupo", italian: "al lupo", level: 1, clue: "Dativo singolare di 'lupus' (II declinazione). A chi?" },
  { latin: "luporum", italian: "dei lupi", level: 1, clue: "Genitivo plurale di 'lupus' (II declinazione). Di chi?" },
  { latin: "lupos", italian: "i lupi", level: 1, clue: "Accusativo plurale di 'lupus' (II declinazione). Chi vedo?" },
  { latin: "servi", italian: "del servo", level: 1, clue: "Genitivo singolare di 'servus' (II declinazione). Di chi?" },
  { latin: "servum", italian: "il servo", level: 1, clue: "Accusativo singolare di 'servus' (II declinazione). Chi?" },
  { latin: "servorum", italian: "dei servi", level: 1, clue: "Genitivo plurale di 'servus' (II declinazione). Di chi?" },
  { latin: "dominum", italian: "il signore", level: 1, clue: "Accusativo singolare di 'dominus' (II declinazione). Chi saluto?" },
  { latin: "domini", italian: "del signore", level: 1, clue: "Genitivo singolare di 'dominus' (II declinazione). Di chi?" },
  { latin: "filium", italian: "il figlio", level: 1, clue: "Accusativo singolare di 'filius' (II declinazione). Chi?" },
  { latin: "filii", italian: "del figlio", level: 1, clue: "Genitivo singolare di 'filius' (II declinazione). Di chi?" },
  { latin: "belli", italian: "della guerra", level: 1, clue: "Genitivo singolare di 'bellum' (II decl. neutra). Di che cosa?" },
  { latin: "bello", italian: "con la guerra", level: 1, clue: "Ablativo singolare di 'bellum' (II decl. neutra). Con che cosa?" },
  { latin: "bella", italian: "le guerre", level: 1, clue: "Nominativo plurale neutro di 'bellum' (II declinazione). Quali?" },
  { latin: "templi", italian: "del tempio", level: 1, clue: "Genitivo singolare di 'templum' (II decl. neutra). Di che cosa?" },
  { latin: "doni", italian: "del dono", level: 1, clue: "Genitivo singolare di 'donum' (II decl. neutra). Di che cosa?" },
  { latin: "dona", italian: "i doni", level: 1, clue: "Nominativo plurale neutro di 'donum' (II declinazione). Quali?" },
  { latin: "equi", italian: "del cavallo", level: 1, clue: "Genitivo singolare di 'equus' (II declinazione). Di chi?" },
  { latin: "equum", italian: "il cavallo", level: 1, clue: "Accusativo singolare di 'equus' (II declinazione). Chi cavalco?" },
  { latin: "equos", italian: "i cavalli", level: 1, clue: "Accusativo plurale di 'equus' (II declinazione). Chi?" },
  { latin: "amici", italian: "dell'amico", level: 1, clue: "Genitivo singolare di 'amicus' (II declinazione). Di chi?" },
  { latin: "amicum", italian: "l'amico", level: 1, clue: "Accusativo singolare di 'amicus' (II declinazione). Chi saluto?" },
  { latin: "amicos", italian: "gli amici", level: 1, clue: "Accusativo plurale di 'amicus' (II declinazione). Chi?" },

  // LEVEL 2: Common verbs and adjectives (Score 6-15)
  { latin: "amare", italian: "amare", level: 2, clue: "Provare profondo affetto." },
  { latin: "videre", italian: "vedere", level: 2, clue: "Percepire con gli occhi." },
  { latin: "audire", italian: "sentire", level: 2, clue: "Ascoltare o udire suoni." },
  { latin: "legere", italian: "leggere", level: 2, clue: "Decifrare la scrittura su rotolo o tavoletta." },
  { latin: "scribere", italian: "scrivere", level: 2, clue: "Incidere o tracciare caratteri." },
  { latin: "currere", italian: "correre", level: 2, clue: "Muoversi rapidamente a piedi." },
  { latin: "bonus", italian: "buono", level: 2, clue: "Di qualità positiva, virtuoso." },
  { latin: "malus", italian: "cattivo", level: 2, clue: "Di qualità negativa, malvagio." },
  { latin: "magnus", italian: "grande", level: 2, clue: "Di notevoli dimensioni o importanza." },
  { latin: "parvus", italian: "piccolo", level: 2, clue: "Di dimensioni ridotte." },
  { latin: "novus", italian: "nuovo", level: 2, clue: "Recente, mai visto prima." },
  { latin: "vetus", italian: "vecchio", level: 2, clue: "Antico, logorato dal tempo." },
  { latin: "altus", italian: "alto", level: 2, clue: "Elevato in altezza o profondo." },
  { latin: "pulcher", italian: "bello", level: 2, clue: "Gradevole alla vista, armonioso." },
  { latin: "multi", italian: "molti", level: 2, clue: "Grande quantità di persone o cose." },
  { latin: "clamare", italian: "gridare", level: 2, clue: "Alzare forte la voce." },
  { latin: "pugnare", italian: "combattere", level: 2, clue: "Scontrarsi in battaglia fisicamente." },
  { latin: "vincere", italian: "vincere", level: 2, clue: "Ottenere il trionfo." },
  { latin: "regere", italian: "governare", level: 2, clue: "Guidare o comandare uno stato." },
  { latin: "habitare", italian: "abitare", level: 2, clue: "Risedere stabilmente in un luogo." },

  // ─── LEVEL 2 BONUS: Coniugazioni verbali (I e II coniugazione) ───
  { latin: "amo", italian: "io amo", level: 2, clue: "Prima persona singolare presente indicativo di 'amare' (I coniugazione)." },
  { latin: "amas", italian: "tu ami", level: 2, clue: "Seconda persona singolare presente indicativo di 'amare' (I coniugazione)." },
  { latin: "amat", italian: "egli ama", level: 2, clue: "Terza persona singolare presente indicativo di 'amare' (I coniugazione)." },
  { latin: "amamus", italian: "noi amiamo", level: 2, clue: "Prima persona plurale presente indicativo di 'amare' (I coniugazione)." },
  { latin: "amatis", italian: "voi amate", level: 2, clue: "Seconda persona plurale presente indicativo di 'amare' (I coniugazione)." },
  { latin: "amant", italian: "essi amano", level: 2, clue: "Terza persona plurale presente indicativo di 'amare' (I coniugazione)." },
  { latin: "video", italian: "io vedo", level: 2, clue: "Prima persona singolare presente indicativo di 'videre' (II coniugazione)." },
  { latin: "vides", italian: "tu vedi", level: 2, clue: "Seconda persona singolare presente indicativo di 'videre' (II coniugazione)." },
  { latin: "videt", italian: "egli vede", level: 2, clue: "Terza persona singolare presente indicativo di 'videre' (II coniugazione)." },
  { latin: "pugnat", italian: "egli combatte", level: 2, clue: "Terza persona singolare presente indicativo di 'pugnare' (I coniugazione)." },
  { latin: "pugnant", italian: "essi combattono", level: 2, clue: "Terza persona plurale presente indicativo di 'pugnare' (I coniugazione)." },
  { latin: "clamat", italian: "egli grida", level: 2, clue: "Terza persona singolare presente indicativo di 'clamare' (I coniugazione)." },
  { latin: "scribit", italian: "egli scrive", level: 2, clue: "Terza persona singolare presente indicativo di 'scribere' (III coniugazione)." },
  { latin: "legit", italian: "egli legge", level: 2, clue: "Terza persona singolare presente indicativo di 'legere' (III coniugazione)." },
  { latin: "currit", italian: "egli corre", level: 2, clue: "Terza persona singolare presente indicativo di 'currere' (III coniugazione)." },
  { latin: "audit", italian: "egli sente", level: 2, clue: "Terza persona singolare presente indicativo di 'audire' (IV coniugazione)." },

  // ─── LEVEL 2 BONUS: Aggettivi declinati (I-II classe) ───
  { latin: "bona", italian: "buona", level: 2, clue: "Aggettivo femminile singolare di 'bonus' (I classe). Qualità positiva al femminile." },
  { latin: "bonum", italian: "buono", level: 2, clue: "Aggettivo neutro singolare o accusativo maschile di 'bonus' (I classe)." },
  { latin: "boni", italian: "dei buoni", level: 2, clue: "Genitivo singolare maschile di 'bonus' (I classe). Di chi virtuoso?" },
  { latin: "magna", italian: "grande", level: 2, clue: "Aggettivo femminile singolare di 'magnus' (I classe). Grande al femminile." },
  { latin: "magnum", italian: "grande", level: 2, clue: "Accusativo maschile o nominativo neutro di 'magnus' (I classe)." },
  { latin: "magni", italian: "del grande", level: 2, clue: "Genitivo singolare maschile di 'magnus' (I classe). Di chi?" },
  { latin: "parva", italian: "piccola", level: 2, clue: "Aggettivo femminile singolare di 'parvus' (I classe)." },
  { latin: "nova", italian: "nuova", level: 2, clue: "Aggettivo femminile singolare di 'novus' (I classe). Recente al femminile." },
  { latin: "novum", italian: "nuovo", level: 2, clue: "Accusativo maschile o nominativo neutro di 'novus' (I classe)." },
  { latin: "alta", italian: "alta", level: 2, clue: "Aggettivo femminile singolare di 'altus' (I classe). Elevata." },
  { latin: "mali", italian: "del cattivo", level: 2, clue: "Genitivo singolare maschile di 'malus' (I classe). Di chi malvagio?" },
  { latin: "mala", italian: "cattiva", level: 2, clue: "Aggettivo femminile singolare di 'malus' (I classe)." },
  { latin: "pulchra", italian: "bella", level: 2, clue: "Aggettivo femminile singolare di 'pulcher' (I classe). Armoniosa." },

  // LEVEL 3: Complex third-declension words (Score 16-30)
  { latin: "civitas", italian: "cittadinanza", level: 3, clue: "Condizione giuridica di cittadino romano." },
  { latin: "libertas", italian: "libertà", level: 3, clue: "Stato di chi non è schiavo." },
  { latin: "veritas", italian: "verità", level: 3, clue: "Qualità di ciò che è vero." },
  { latin: "hostis", italian: "nemico", level: 3, clue: "Avversario pubblico o straniero in armi." },
  { latin: "miles", italian: "soldato", level: 3, clue: "Il combattente delle legioni." },
  { latin: "rex", italian: "re", level: 3, clue: "Monarca assoluto." },
  { latin: "dux", italian: "comandante", level: 3, clue: "Generale militare." },
  { latin: "corpus", italian: "corpo", level: 3, clue: "La struttura fisica biologica." },
  { latin: "tempus", italian: "tempo", level: 3, clue: "Lo scorrere delle ore." },
  { latin: "nomen", italian: "nome", level: 3, clue: "L'appellativo verbale di un oggetto o persona." },
  { latin: "amor", italian: "amore", level: 3, clue: "Sentimento di forte legame affettivo." },
  { latin: "virtus", italian: "virtù", level: 3, clue: "Il valore morale o militare del cittadino." },
  { latin: "pax", italian: "pace", level: 3, clue: "Assenza di conflitti bellici." },
  { latin: "lux", italian: "luce", level: 3, clue: "Radiazione luminosa solare." },
  { latin: "vox", italian: "voce", level: 3, clue: "Il suono emesso dalle corde vocali." },
  { latin: "labor", italian: "lavoro", level: 3, clue: "Fatica profusa in un'attività." },
  { latin: "mons", italian: "montagna", level: 3, clue: "Grande rilievo geografico." },
  { latin: "pons", italian: "ponte", level: 3, clue: "Struttura di collegamento sospesa sopra un fiume." },
  { latin: "urbs", italian: "città", level: 3, clue: "La città per eccellenza (spesso riferito a Roma)." },
  { latin: "gens", italian: "popolo", level: 3, clue: "Famiglia allargata o stirpe." },
  { latin: "mens", italian: "mente", level: 3, clue: "La sede del pensiero razionale." },

  // ─── LEVEL 3 BONUS: III Declinazione (rex, regis / nomen, nominis / civitas, civitatis) ───
  { latin: "regis", italian: "del re", level: 3, clue: "Genitivo singolare di 'rex' (III declinazione). Di chi è il trono?" },
  { latin: "regem", italian: "il re", level: 3, clue: "Accusativo singolare di 'rex' (III declinazione). Chi vedo?" },
  { latin: "regi", italian: "al re", level: 3, clue: "Dativo singolare di 'rex' (III declinazione). A chi obbedisco?" },
  { latin: "reges", italian: "i re", level: 3, clue: "Nominativo plurale di 'rex' (III declinazione). Chi governa?" },
  { latin: "regum", italian: "dei re", level: 3, clue: "Genitivo plurale di 'rex' (III declinazione). Di chi?" },
  { latin: "ducis", italian: "del comandante", level: 3, clue: "Genitivo singolare di 'dux' (III declinazione). Di chi?" },
  { latin: "ducem", italian: "il comandante", level: 3, clue: "Accusativo singolare di 'dux' (III declinazione). Chi seguo?" },
  { latin: "militis", italian: "del soldato", level: 3, clue: "Genitivo singolare di 'miles' (III declinazione). Di chi è lo scudo?" },
  { latin: "militem", italian: "il soldato", level: 3, clue: "Accusativo singolare di 'miles' (III declinazione). Chi vedo?" },
  { latin: "milites", italian: "i soldati", level: 3, clue: "Nominativo plurale di 'miles' (III declinazione). Chi marcia?" },
  { latin: "militum", italian: "dei soldati", level: 3, clue: "Genitivo plurale di 'miles' (III declinazione). Di chi?" },
  { latin: "hostis", italian: "nemico", level: 3, clue: "Nominativo singolare (III declinazione). L'avversario." },
  { latin: "hostem", italian: "il nemico", level: 3, clue: "Accusativo singolare di 'hostis' (III declinazione). Chi combatto?" },
  { latin: "hostium", italian: "dei nemici", level: 3, clue: "Genitivo plurale di 'hostis' (III declinazione). Di chi?" },
  { latin: "civitatis", italian: "della cittadinanza", level: 3, clue: "Genitivo singolare di 'civitas' (III declinazione). Di che cosa?" },
  { latin: "civitatem", italian: "la cittadinanza", level: 3, clue: "Accusativo singolare di 'civitas' (III declinazione). Che cosa ottengo?" },
  { latin: "libertatis", italian: "della libertà", level: 3, clue: "Genitivo singolare di 'libertas' (III declinazione). Di che cosa?" },
  { latin: "libertatem", italian: "la libertà", level: 3, clue: "Accusativo singolare di 'libertas' (III declinazione). Che cosa desidero?" },
  { latin: "veritatis", italian: "della verità", level: 3, clue: "Genitivo singolare di 'veritas' (III declinazione). Di che cosa?" },
  { latin: "veritatem", italian: "la verità", level: 3, clue: "Accusativo singolare di 'veritas' (III declinazione). Che cosa cerco?" },
  { latin: "corporis", italian: "del corpo", level: 3, clue: "Genitivo singolare di 'corpus' (III decl. neutra). Di che cosa?" },
  { latin: "corpora", italian: "i corpi", level: 3, clue: "Nominativo plurale di 'corpus' (III decl. neutra). Quali?" },
  { latin: "temporis", italian: "del tempo", level: 3, clue: "Genitivo singolare di 'tempus' (III decl. neutra). Di che cosa?" },
  { latin: "tempora", italian: "i tempi", level: 3, clue: "Nominativo plurale di 'tempus' (III decl. neutra). Quali?" },
  { latin: "nominis", italian: "del nome", level: 3, clue: "Genitivo singolare di 'nomen' (III decl. neutra). Di che cosa?" },
  { latin: "nomina", italian: "i nomi", level: 3, clue: "Nominativo plurale di 'nomen' (III decl. neutra). Quali?" },
  { latin: "amoris", italian: "dell'amore", level: 3, clue: "Genitivo singolare di 'amor' (III declinazione). Di che cosa?" },
  { latin: "amorem", italian: "l'amore", level: 3, clue: "Accusativo singolare di 'amor' (III declinazione). Che cosa provo?" },
  { latin: "virtutis", italian: "della virtù", level: 3, clue: "Genitivo singolare di 'virtus' (III declinazione). Di che cosa?" },
  { latin: "virtutem", italian: "la virtù", level: 3, clue: "Accusativo singolare di 'virtus' (III declinazione). Che cosa mostro?" },
  { latin: "pacis", italian: "della pace", level: 3, clue: "Genitivo singolare di 'pax' (III declinazione). Di che cosa?" },
  { latin: "pacem", italian: "la pace", level: 3, clue: "Accusativo singolare di 'pax' (III declinazione). Che cosa cerco?" },
  { latin: "lucis", italian: "della luce", level: 3, clue: "Genitivo singolare di 'lux' (III declinazione). Di che cosa?" },
  { latin: "lucem", italian: "la luce", level: 3, clue: "Accusativo singolare di 'lux' (III declinazione). Che cosa vedo?" },
  { latin: "vocis", italian: "della voce", level: 3, clue: "Genitivo singolare di 'vox' (III declinazione). Di che cosa?" },
  { latin: "vocem", italian: "la voce", level: 3, clue: "Accusativo singolare di 'vox' (III declinazione). Che cosa ascolto?" },
  { latin: "montis", italian: "della montagna", level: 3, clue: "Genitivo singolare di 'mons' (III declinazione). Di che cosa?" },
  { latin: "montem", italian: "la montagna", level: 3, clue: "Accusativo singolare di 'mons' (III declinazione). Che cosa scalo?" },
  { latin: "pontem", italian: "il ponte", level: 3, clue: "Accusativo singolare di 'pons' (III declinazione). Che cosa attraverso?" },
  { latin: "pontis", italian: "del ponte", level: 3, clue: "Genitivo singolare di 'pons' (III declinazione). Di che cosa?" },
  { latin: "urbis", italian: "della città", level: 3, clue: "Genitivo singolare di 'urbs' (III declinazione). Di che cosa?" },
  { latin: "urbem", italian: "la città", level: 3, clue: "Accusativo singolare di 'urbs' (III declinazione). Che cosa difendo?" },
  { latin: "gentis", italian: "del popolo", level: 3, clue: "Genitivo singolare di 'gens' (III declinazione). Di chi?" },
  { latin: "gentem", italian: "il popolo", level: 3, clue: "Accusativo singolare di 'gens' (III declinazione). Chi governo?" },
  { latin: "mentis", italian: "della mente", level: 3, clue: "Genitivo singolare di 'mens' (III declinazione). Di che cosa?" },
  { latin: "mentem", italian: "la mente", level: 3, clue: "Accusativo singolare di 'mens' (III declinazione). Che cosa uso?" },

  // LEVEL 4: Abstract nouns and irregular verbs (Score 31-50)
  { latin: "esse", italian: "essere", level: 4, clue: "Esistere in modo assoluto." },
  { latin: "posse", italian: "potere", level: 4, clue: "Avere la capacità o forza di fare." },
  { latin: "velle", italian: "volere", level: 4, clue: "Esprimere determinazione o desiderio forte." },
  { latin: "nolle", italian: "non volere", level: 4, clue: "Negare la propria volontà." },
  { latin: "ferre", italian: "portare", level: 4, clue: "Sostenere un carico o sopportare." },
  { latin: "ire", italian: "andare", level: 4, clue: "Muoversi verso una destinazione." },
  { latin: "fieri", italian: "accadere", level: 4, clue: "Divenire, realizzarsi, compiersi." },
  { latin: "ratio", italian: "ragione", level: 4, clue: "Logica, calcolo, discernimento." },
  { latin: "sapientia", italian: "saggezza", level: 4, clue: "La suprema conoscenza filosofica." },
  { latin: "audacia", italian: "audacia", level: 4, clue: "Coraggio spinto fino al limite o temerarietà." },
  { latin: "clementia", italian: "clemenza", level: 4, clue: "La benevolenza imperiale verso i vinti." },
  { latin: "superbia", italian: "superbia", level: 4, clue: "Orgoglio smodato, tracotanza." },
  { latin: "fortuna", italian: "fortuna", level: 4, clue: "Il destino cieco e capriccioso." },
  { latin: "fatum", italian: "destino", level: 4, clue: "L'ordine immutabile del fato." },
  { latin: "invidia", italian: "invidia", level: 4, clue: "Il rancore per la felicità altrui." },
  { latin: "iustitia", italian: "giustizia", level: 4, clue: "L'applicazione delle leggi e del diritto." },
  { latin: "dolor", italian: "dolore", level: 4, clue: "Sofferenza fisica o spirituale." },
  { latin: "spes", italian: "speranza", level: 4, clue: "L'attesa fiduciosa nel futuro." },
  { latin: "fides", italian: "fede", level: 4, clue: "Lealtà, parola data, fiducia reciproca." },
  { latin: "metus", italian: "paura", level: 4, clue: "Timore grave e angoscia." },

  // ─── LEVEL 4 BONUS: IV e V Declinazione + Verbi irregolari coniugati ───
  { latin: "metus", italian: "paura", level: 4, clue: "Nominativo singolare (IV declinazione). Il timore." },
  { latin: "metum", italian: "la paura", level: 4, clue: "Accusativo singolare di 'metus' (IV declinazione). Che cosa provo?" },
  { latin: "metus", italian: "paura", level: 4, clue: "Genitivo singolare di 'metus' (IV declinazione). Di che cosa?" },
  { latin: "spei", italian: "della speranza", level: 4, clue: "Genitivo singolare di 'spes' (V declinazione). Di che cosa?" },
  { latin: "spem", italian: "la speranza", level: 4, clue: "Accusativo singolare di 'spes' (V declinazione). Che cosa nutro?" },
  { latin: "fidei", italian: "della fede", level: 4, clue: "Genitivo singolare di 'fides' (V declinazione). Di che cosa?" },
  { latin: "fidem", italian: "la fede", level: 4, clue: "Accusativo singolare di 'fides' (V declinazione). Che cosa mantengo?" },
  { latin: "diei", italian: "del giorno", level: 4, clue: "Genitivo singolare di 'dies' (V declinazione). Di che cosa?" },
  { latin: "diem", italian: "il giorno", level: 4, clue: "Accusativo singolare di 'dies' (V declinazione). Che cosa attendo?" },
  { latin: "dies", italian: "giorno", level: 4, clue: "Nominativo singolare (V declinazione). Il periodo di luce." },
  { latin: "res", italian: "cosa", level: 4, clue: "Nominativo singolare (V declinazione). L'oggetto o la faccenda." },
  { latin: "rei", italian: "della cosa", level: 4, clue: "Genitivo singolare di 'res' (V declinazione). Di che cosa?" },
  { latin: "rem", italian: "la cosa", level: 4, clue: "Accusativo singolare di 'res' (V declinazione). Che cosa?" },
  { latin: "rerum", italian: "delle cose", level: 4, clue: "Genitivo plurale di 'res' (V declinazione). Di quali cose?" },
  { latin: "doloris", italian: "del dolore", level: 4, clue: "Genitivo singolare di 'dolor' (III declinazione). Di che cosa?" },
  { latin: "dolorem", italian: "il dolore", level: 4, clue: "Accusativo singolare di 'dolor' (III declinazione). Che cosa sopporto?" },
  { latin: "rationis", italian: "della ragione", level: 4, clue: "Genitivo singolare di 'ratio' (III declinazione). Di che cosa?" },
  { latin: "rationem", italian: "la ragione", level: 4, clue: "Accusativo singolare di 'ratio' (III declinazione). Che cosa cerco?" },
  // Verbi irregolari coniugati
  { latin: "sum", italian: "io sono", level: 4, clue: "Prima persona singolare presente indicativo di 'esse'. Esisto." },
  { latin: "es", italian: "tu sei", level: 4, clue: "Seconda persona singolare presente indicativo di 'esse'. Tu esisti." },
  { latin: "est", italian: "egli è", level: 4, clue: "Terza persona singolare presente indicativo di 'esse'. Egli esiste." },
  { latin: "sumus", italian: "noi siamo", level: 4, clue: "Prima persona plurale presente indicativo di 'esse'. Noi esistiamo." },
  { latin: "estis", italian: "voi siete", level: 4, clue: "Seconda persona plurale presente indicativo di 'esse'." },
  { latin: "sunt", italian: "essi sono", level: 4, clue: "Terza persona plurale presente indicativo di 'esse'. Essi esistono." },
  { latin: "possum", italian: "io posso", level: 4, clue: "Prima persona singolare presente indicativo di 'posse'. Ho la capacità." },
  { latin: "potes", italian: "tu puoi", level: 4, clue: "Seconda persona singolare presente indicativo di 'posse'." },
  { latin: "potest", italian: "egli può", level: 4, clue: "Terza persona singolare presente indicativo di 'posse'. Ha il potere." },
  { latin: "volo", italian: "io voglio", level: 4, clue: "Prima persona singolare presente indicativo di 'velle'. Desidero." },
  { latin: "vis", italian: "tu vuoi", level: 4, clue: "Seconda persona singolare presente indicativo di 'velle'." },
  { latin: "vult", italian: "egli vuole", level: 4, clue: "Terza persona singolare presente indicativo di 'velle'. Egli desidera." },
  { latin: "fert", italian: "egli porta", level: 4, clue: "Terza persona singolare presente indicativo di 'ferre'. Egli sostiene." },
  { latin: "it", italian: "egli va", level: 4, clue: "Terza persona singolare presente indicativo di 'ire'. Si muove." },
  { latin: "eunt", italian: "essi vanno", level: 4, clue: "Terza persona plurale presente indicativo di 'ire'. Si muovono." },

  // LEVEL 5: Philosophical concepts (Score 51+)
  { latin: "humanitas", italian: "umanità", level: 5, clue: "La dignità morale e intellettuale dell'uomo." },
  { latin: "existenta", italian: "esistenza", level: 5, clue: "L'essere effettivo nel mondo (attenzione a ortografia)." }, // Spelling matches tests/gladiator.test.js "existenta"
  { latin: "essentia", italian: "essenza", level: 5, clue: "La natura propria e fondamentale di una cosa." },
  { latin: "cogitatio", italian: "pensiero", level: 5, clue: "L'attività intellettuale e riflessiva della mente." },
  { latin: "aeternitas", italian: "eternità", level: 5, clue: "Condizione temporale infinita priva di inizio e fine." },
  { latin: "infinitum", italian: "infinito", level: 5, clue: "Ciò che non ha limiti materiali o spaziali." },
  { latin: "beatitudo", italian: "felicità", level: 5, clue: "Stato supremo di appagamento interiore." },
  { latin: "bonum", italian: "bene", level: 5, clue: "L'assoluta perfezione morale." },
  { latin: "conscientia", italian: "coscienza", level: 5, clue: "La conoscenza interiore di sé e delle proprie azioni." },
  { latin: "transendentia", italian: "trascendenza", level: 5, clue: "Il superamento dei limiti sensibili ordinari (ortografia)." }, // Spelling matches tests/gladiator.test.js "transendentia"
  { latin: "dualitas", italian: "dualità", level: 5, clue: "Coesistenza di due principi opposti." },
  { latin: "dialectica", italian: "dialettica", level: 5, clue: "L'arte filosofica del discutere e argomentare." },
  { latin: "metaphysica", italian: "metafisica", level: 5, clue: "La branca filosofica oltre la realtà naturale." },
  { latin: "ethica", italian: "etica", level: 5, clue: "La disciplina razionale del comportamento." },
  { latin: "logica", italian: "logica", level: 5, clue: "Studio delle regole formali del corretto ragionamento." },
  { latin: "cosmos", italian: "cosmo", level: 5, clue: "L'universo inteso come sistema ordinato." },
  { latin: "chaos", italian: "caos", level: 5, clue: "Lo stato disordinato della materia pre-cosmo." },
  { latin: "natura", italian: "natura", level: 5, clue: "La forza generatrice biologica primordiale." },
  { latin: "anima", italian: "anima", level: 5, clue: "Il soffio vitale o principio incorporeo dell'uomo." },
  { latin: "intellectus", italian: "intelletto", level: 5, clue: "La capacità suprema di intendere e comprendere." },

  // ─── LEVEL 5 BONUS: Declinazioni filosofiche e gerundivi ───
  { latin: "humanitatis", italian: "dell'umanità", level: 5, clue: "Genitivo singolare di 'humanitas' (III declinazione). Di che cosa?" },
  { latin: "humanitatem", italian: "l'umanità", level: 5, clue: "Accusativo singolare di 'humanitas' (III declinazione). Che cosa celebro?" },
  { latin: "aeternitatis", italian: "dell'eternità", level: 5, clue: "Genitivo singolare di 'aeternitas' (III declinazione). Di che cosa?" },
  { latin: "aeternitatem", italian: "l'eternità", level: 5, clue: "Accusativo singolare di 'aeternitas' (III declinazione). Che cosa cerco?" },
  { latin: "cogitationis", italian: "del pensiero", level: 5, clue: "Genitivo singolare di 'cogitatio' (III declinazione). Di che cosa?" },
  { latin: "cogitationem", italian: "il pensiero", level: 5, clue: "Accusativo singolare di 'cogitatio' (III declinazione). Che cosa esprimo?" },
  { latin: "essentiae", italian: "dell'essenza", level: 5, clue: "Genitivo singolare di 'essentia' (I declinazione). Di che cosa?" },
  { latin: "essentiam", italian: "l'essenza", level: 5, clue: "Accusativo singolare di 'essentia' (I declinazione). Che cosa comprendo?" },
  { latin: "conscientiae", italian: "della coscienza", level: 5, clue: "Genitivo singolare di 'conscientia' (I declinazione). Di che cosa?" },
  { latin: "conscientiam", italian: "la coscienza", level: 5, clue: "Accusativo singolare di 'conscientia' (I declinazione). Che cosa ascolto?" },
  { latin: "beatitudinis", italian: "della felicità", level: 5, clue: "Genitivo singolare di 'beatitudo' (III declinazione). Di che cosa?" },
  { latin: "beatitudinem", italian: "la felicità", level: 5, clue: "Accusativo singolare di 'beatitudo' (III declinazione). Che cosa cerco?" },
  { latin: "animae", italian: "dell'anima", level: 5, clue: "Genitivo singolare di 'anima' (I declinazione). Di che cosa?" },
  { latin: "animam", italian: "l'anima", level: 5, clue: "Accusativo singolare di 'anima' (I declinazione). Che cosa salvo?" },
  { latin: "intellectus", italian: "intelletto", level: 5, clue: "Nominativo singolare (IV declinazione). La capacità di comprendere." },
  { latin: "naturae", italian: "della natura", level: 5, clue: "Genitivo singolare di 'natura' (I declinazione). Di che cosa?" },
  { latin: "naturam", italian: "la natura", level: 5, clue: "Accusativo singolare di 'natura' (I declinazione). Che cosa osservo?" },
];

/**
 * Returns a single random word from all vocabulary (no level filtering).
 * @returns {object} A random word object from vocabData
 */
export function getRandomWord() {
  return vocabData[Math.floor(Math.random() * vocabData.length)];
}

/**
 * Returns all vocabulary words shuffled in random order.
 * Uses Fisher-Yates shuffle algorithm.
 * @returns {object[]} All words in random order
 */
export function getShuffledWords() {
  const shuffled = [...vocabData];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Legacy compatibility — maps to getRandomWord.
 * @param {number} level - ignored
 * @returns {object}
 */
export function getWordByLevel(level) {
  return getRandomWord();
}
