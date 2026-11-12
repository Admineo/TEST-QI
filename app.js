const TOTAL_QUESTIONS = 30;
const TOTAL_SECONDS = 30 * 60;
const HISTORY_KEY = "test-qi-results-v1";
const categories = ["Logique", "Calcul mental", "Observation visuelle"];

const questions = [
  { category: "Logique", text: "Quelle est la suite : 2, 4, 8, 16, …", options: ["18", "24", "32", "36"], answer: 2, explanation: "Chaque terme est multiplié par 2 : 16 × 2 = 32." },
  { category: "Observation visuelle", text: "Quelle forme complète la série ?", visual: "<svg viewBox='0 0 360 92' role='img' aria-label='Carré, cercle, carré, cercle, point d’interrogation'><rect x='25' y='24' width='42' height='42' rx='4' fill='#7dd3fc'/><circle cx='125' cy='45' r='22' fill='#c084fc'/><rect x='205' y='24' width='42' height='42' rx='4' fill='#7dd3fc'/><circle cx='305' cy='45' r='22' fill='#c084fc'/></svg>", options: ["Carré", "Cercle", "Triangle", "Losange"], answer: 0, explanation: "Les formes alternent carré, cercle ; la suivante est donc un carré." },
  { category: "Logique", text: "Tous les Nors sont des Vels. Tous les Vels sont des Tims. Que peut-on conclure ?", options: ["Tous les Tims sont des Nors", "Tous les Nors sont des Tims", "Aucun Nor n’est un Tim", "On ne peut rien conclure"], answer: 1, explanation: "Si chaque Nor appartient aux Vels, et chaque Vel aux Tims, chaque Nor est aussi un Tim." },
  { category: "Calcul mental", text: "Calculez mentalement : 15 % de 200 = ?", options: ["20", "25", "30", "35"], answer: 2, explanation: "10 % de 200 font 20 et 5 % font 10 ; ensemble, cela donne 30." },
  { category: "Calcul mental", text: "Un livre et un stylo coûtent 11 €. Le livre coûte 10 € de plus que le stylo. Prix du stylo ?", options: ["0,50 €", "1 €", "1,50 €", "2 €"], answer: 0, explanation: "Le stylo coûte 0,50 € et le livre 10,50 €, soit 11 € au total." },
  { category: "Logique", text: "Quelle lettre suit la série : A, C, F, J, O, …", options: ["S", "T", "U", "V"], answer: 2, explanation: "On avance de 2, 3, 4, puis 5 lettres ; ensuite on avance de 6 : U." },
  { category: "Observation visuelle", text: "Combien de triangles voyez-vous dans cette figure ?", visual: "<svg viewBox='0 0 180 130' role='img' aria-label='Un grand triangle partagé en quatre petits triangles'><path d='M90 10 L15 120 H165 Z M52.5 65 H127.5 M90 10 V120' fill='none' stroke='#7dd3fc' stroke-width='4' stroke-linejoin='round'/></svg>", options: ["3", "4", "5", "6"], answer: 1, explanation: "La figure contient quatre petits triangles ; aucun triangle plus grand n’est entièrement délimité par les segments." },
  { category: "Logique", text: "Léa est plus grande que Sam. Sam est plus grand que Noé. Qui est le plus petit ?", options: ["Léa", "Sam", "Noé", "Impossible à savoir"], answer: 2, explanation: "L’ordre est Léa, puis Sam, puis Noé : Noé est le plus petit." },
  { category: "Calcul mental", text: "Quelle est la suite : 3, 6, 11, 18, 27, …", options: ["36", "38", "40", "42"], answer: 1, explanation: "Les écarts sont 3, 5, 7, 9 ; le prochain écart est 11. 27 + 11 = 38." },
  { category: "Logique", text: "Si hier était dimanche, quel jour sera après-demain ?", options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"], answer: 2, explanation: "Hier dimanche signifie aujourd’hui lundi. Après-demain sera mercredi." },
  { category: "Calcul mental", text: "Une horloge avance de 5 minutes par heure. De combien avancera-t-elle en 6 heures ?", options: ["20 min", "25 min", "30 min", "35 min"], answer: 2, explanation: "5 minutes × 6 heures = 30 minutes." },
  { category: "Observation visuelle", text: "Quelle flèche vient ensuite ?", visual: "<svg viewBox='0 0 360 100' role='img' aria-label='Flèches orientées vers le haut, la droite, le bas, puis point d’interrogation'><text x='35' y='68' font-size='52' fill='#7dd3fc'>↑</text><text x='125' y='68' font-size='52' fill='#c084fc'>→</text><text x='215' y='68' font-size='52' fill='#7dd3fc'>↓</text><text x='305' y='68' font-size='52' fill='#c084fc'>?</text></svg>", options: ["↑", "→", "↓", "←"], answer: 3, explanation: "La flèche tourne d’un quart de tour dans le sens horaire à chaque étape ; la prochaine pointe à gauche." },
  { category: "Calcul mental", text: "Si 5 pommes coûtent 15 €, combien coûtent 8 pommes au même prix unitaire ?", options: ["18 €", "21 €", "24 €", "30 €"], answer: 2, explanation: "Une pomme coûte 3 €. Huit pommes coûtent 8 × 3 = 24 €." },
  { category: "Logique", text: "Quel mot est différent : rouge, bleu, jaune, triangle ?", options: ["Rouge", "Bleu", "Jaune", "Triangle"], answer: 3, explanation: "Rouge, bleu et jaune sont des couleurs ; triangle est une forme." },
  { category: "Observation visuelle", text: "Quel motif vient ensuite ?", visual: "<svg viewBox='0 0 360 90' role='img' aria-label='Un point, deux points, trois points, puis point d’interrogation'><circle cx='45' cy='45' r='8' fill='#7dd3fc'/><circle cx='125' cy='45' r='8' fill='#7dd3fc'/><circle cx='145' cy='45' r='8' fill='#7dd3fc'/><circle cx='215' cy='45' r='8' fill='#7dd3fc'/><circle cx='235' cy='45' r='8' fill='#7dd3fc'/><circle cx='255' cy='45' r='8' fill='#7dd3fc'/><text x='310' y='58' font-size='36' fill='#c084fc'>?</text></svg>", options: ["Un point", "Deux points", "Trois points", "Quatre points"], answer: 3, explanation: "Le nombre de points augmente de un à chaque étape : le prochain groupe en contient quatre." },
  { category: "Calcul mental", text: "Quel est le quart de 84 ?", options: ["18", "20", "21", "24"], answer: 2, explanation: "84 ÷ 4 = 21." },
  { category: "Logique", text: "Un train part à 8 h 15 et arrive à 9 h 45. Quelle est la durée du trajet ?", options: ["1 h 15", "1 h 30", "1 h 45", "2 h"], answer: 1, explanation: "De 8 h 15 à 9 h 15, une heure ; puis 30 minutes : 1 h 30." },
  { category: "Observation visuelle", text: "Quel carré est identique au modèle ?", visual: "<svg viewBox='0 0 360 125' role='img' aria-label='Modèle : cercle en haut à gauche, étoile en bas à droite'><rect x='15' y='10' width='100' height='100' rx='8' fill='none' stroke='#9db0c4' stroke-width='3'/><circle cx='42' cy='38' r='12' fill='#7dd3fc'/><path d='M87 73 l5 10 11 1-8 7 2 11-10-5-10 5 2-11-8-7 11-1z' fill='#c084fc'/><rect x='145' y='10' width='80' height='100' rx='8' fill='none' stroke='#53637a' stroke-width='2'/><circle cx='165' cy='30' r='9' fill='#7dd3fc'/><path d='M195 72l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z' fill='#c084fc'/><rect x='250' y='10' width='80' height='100' rx='8' fill='none' stroke='#53637a' stroke-width='2'/><circle cx='310' cy='30' r='9' fill='#7dd3fc'/><path d='M275 72l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z' fill='#c084fc'/></svg>", options: ["A", "B", "Les deux", "Aucun"], answer: 0, explanation: "Le modèle place le cercle en haut à gauche et l’étoile en bas à droite : seul le carré A respecte ces positions." },
  { category: "Calcul mental", text: "Calculez : 48 ÷ 6 + 7 × 2 = ?", options: ["22", "30", "36", "42"], answer: 0, explanation: "On effectue d’abord division et multiplication : 8 + 14 = 22." },
  { category: "Logique", text: "Complétez la suite : 4, 9, 16, 25, …", options: ["30", "36", "49", "64"], answer: 1, explanation: "Ce sont les carrés de 2, 3, 4, 5 ; le prochain est 6² = 36." },
  { category: "Observation visuelle", text: "Quel symbole est en miroir du modèle ?", visual: "<svg viewBox='0 0 260 100' role='img' aria-label='Une flèche modèle orientée vers la droite et une ligne de miroir verticale'><text x='35' y='68' font-size='54' fill='#7dd3fc'>➤</text><path d='M130 12 V88' stroke='#c084fc' stroke-width='3' stroke-dasharray='6 5'/><text x='165' y='68' font-size='54' fill='#9db0c4'>?</text></svg>", options: ["➤", "◀", "▼", "◆"], answer: 1, explanation: "Le reflet horizontal d’une flèche pointant vers la droite pointe vers la gauche." },
  { category: "Calcul mental", text: "Un article à 80 € bénéficie d’une réduction de 25 %. Quel est son nouveau prix ?", options: ["55 €", "60 €", "65 €", "70 €"], answer: 1, explanation: "25 % de 80 € = 20 €. 80 € − 20 € = 60 €." },
  { category: "Logique", text: "Tous les chats sont des mammifères. Certains mammifères vivent dans l’eau. Peut-on conclure que certains chats vivent dans l’eau ?", options: ["Oui, toujours", "Non, pas avec ces informations", "Tous les chats vivent dans l’eau", "Aucun mammifère ne vit dans l’eau"], answer: 1, explanation: "Les informations ne disent pas si les mammifères aquatiques sont des chats." },
  { category: "Observation visuelle", text: "Combien de petits carrés composent cette grille ?", visual: "<svg viewBox='0 0 150 150' role='img' aria-label='Grille de trois colonnes et trois rangées'><rect x='20' y='20' width='110' height='110' fill='none' stroke='#7dd3fc' stroke-width='4'/><path d='M56.67 20v110 M93.33 20v110 M20 56.67h110 M20 93.33h110' stroke='#c084fc' stroke-width='3'/></svg>", options: ["6", "8", "9", "12"], answer: 2, explanation: "La grille a 3 colonnes et 3 rangées : 3 × 3 = 9 petits carrés." },
  { category: "Calcul mental", text: "Une voiture parcourt 150 km en 2 heures. Quelle est sa vitesse moyenne ?", options: ["60 km/h", "70 km/h", "75 km/h", "80 km/h"], answer: 2, explanation: "Vitesse moyenne = distance ÷ temps : 150 ÷ 2 = 75 km/h." },
  { category: "Logique", text: "Quel nombre ne suit pas la règle ? 8, 16, 24, 32, 41", options: ["8", "16", "24", "41"], answer: 3, explanation: "Les quatre premiers nombres sont des multiples de 8. 41 ne l’est pas." },
  { category: "Observation visuelle", text: "Lequel de ces motifs est une rotation du modèle ?", visual: "<svg viewBox='0 0 240 110' role='img' aria-label='Modèle en forme de L et deux choix'><path d='M34 22v58h50' fill='none' stroke='#7dd3fc' stroke-width='12' stroke-linecap='square'/><text x='113' y='68' font-size='22' fill='#c084fc'>→</text><path d='M158 22h50v58' fill='none' stroke='#34d399' stroke-width='12' stroke-linecap='square'/></svg>", options: ["L vertical, puis vers la droite", "L inversé, puis vers la gauche", "Une ligne droite", "Un carré"], answer: 0, explanation: "Après une rotation d’un quart de tour, les deux segments restent perpendiculaires et l’orientation correspond au premier choix." },
  { category: "Calcul mental", text: "Une recette pour 4 personnes demande 300 g de farine. Combien faut-il pour 6 personnes ?", options: ["400 g", "450 g", "500 g", "600 g"], answer: 1, explanation: "300 ÷ 4 = 75 g par personne. 75 × 6 = 450 g." },
  { category: "Logique", text: "Dans une course, vous dépassez la personne en deuxième position. À quelle place êtes-vous maintenant ?", options: ["Première", "Deuxième", "Troisième", "Impossible à savoir"], answer: 1, explanation: "En dépassant la personne deuxième, vous prenez sa place : vous êtes deuxième." },
  { category: "Observation visuelle", text: "Quelle pièce complète le motif alterné ?", visual: "<svg viewBox='0 0 360 90' role='img' aria-label='Cercle plein, cercle vide, cercle plein, cercle vide, point d’interrogation'><circle cx='40' cy='45' r='20' fill='#7dd3fc'/><circle cx='120' cy='45' r='20' fill='none' stroke='#c084fc' stroke-width='5'/><circle cx='210' cy='45' r='20' fill='#7dd3fc'/><circle cx='290' cy='45' r='20' fill='none' stroke='#c084fc' stroke-width='5'/></svg>", options: ["Cercle plein", "Cercle vide", "Carré plein", "Triangle vide"], answer: 0, explanation: "Le motif alterne cercle plein et cercle vide ; après un cercle vide vient un cercle plein." },
  { category: "Calcul mental", text: "Combien font 17 × 6 ?", options: ["92", "96", "102", "112"], answer: 2, explanation: "17 × 6 = (10 × 6) + (7 × 6) = 60 + 42 = 102." },
  { category: "Logique", text: "Une boîte contient des chaussettes rouges et bleues. Combien faut-il en prendre au minimum, dans le noir, pour être sûr d’avoir une paire de même couleur ?", options: ["2", "3", "4", "5"], answer: 1, explanation: "Avec deux couleurs, trois chaussettes garantissent qu’au moins deux sont de la même couleur." }
];

if (questions.length !== TOTAL_QUESTIONS) throw new Error(`Le quiz doit contenir exactement ${TOTAL_QUESTIONS} questions.`);

const intro = document.querySelector("#intro");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const timer = document.querySelector("#timer");
const soundToggle = document.querySelector("#sound-toggle");
const count = document.querySelector("#question-count");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const categoryLabel = document.querySelector("#category-label");
const title = document.querySelector("#question-title");
const visual = document.querySelector("#question-visual");
const answers = document.querySelector("#answers");
const scoreValue = document.querySelector("#score-value");
const resultMessage = document.querySelector("#result-message");
const timeMessage = document.querySelector("#time-message");
const timeLeftResult = document.querySelector("#time-left-result");
const scorePercent = document.querySelector("#score-percent");
const resultBadge = document.querySelector("#result-badge");
const confetti = document.querySelector("#confetti");
const categoryResults = document.querySelector("#category-results");
const review = document.querySelector("#review");
const reviewList = document.querySelector("#review-list");
const saveStatus = document.querySelector("#save-status");

let current = 0;
let score = 0;
let timeLeft = TOTAL_SECONDS;
let timerId = null;
let locked = false;
let soundEnabled = true;
let audioCtx = null;
let answersGiven = [];
let finished = false;
let finalResult = null;

function formatTime(value) {
  const minutes = Math.floor(value / 60);
  return `${String(minutes).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function ensureAudio() {
  if (!soundEnabled) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
}

function playTone(frequency, duration, type = "sine", volume = 0.045) {
  if (!soundEnabled || !audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function updateTimer() {
  timer.textContent = formatTime(timeLeft);
  timer.classList.toggle("warning", timeLeft <= 30);
}

function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (timeLeft <= 1) {
      timeLeft = 0;
      updateTimer();
      endTest(true);
      return;
    }
    timeLeft -= 1;
    updateTimer();
  }, 1000);
}

function showQuestion() {
  const question = questions[current];
  const pct = Math.round((current / TOTAL_QUESTIONS) * 100);
  count.textContent = `Question ${current + 1} sur ${TOTAL_QUESTIONS}`;
  progressLabel.textContent = `${pct} %`;
  progressTrack.setAttribute("aria-valuenow", String(current));
  progressFill.style.width = `${pct}%`;
  categoryLabel.textContent = question.category;
  title.textContent = question.text;
  if (question.visual) {
    visual.innerHTML = question.visual;
    visual.hidden = false;
  } else {
    visual.replaceChildren();
    visual.hidden = true;
  }
  answers.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    const key = document.createElement("span");
    key.className = "answer-letter";
    key.setAttribute("aria-hidden", "true");
    key.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.textContent = option;
    button.append(key, label);
    button.addEventListener("click", () => chooseAnswer(index));
    answers.append(button);
  });
  title.focus({ preventScroll: true });
}

function chooseAnswer(index) {
  if (locked || finished) return;
  locked = true;
  const question = questions[current];
  const isCorrect = index === question.answer;
  answersGiven.push(index);
  if (isCorrect) {
    score += 1;
    playTone(740, 0.12, "triangle");
  } else {
    playTone(210, 0.15, "sawtooth", 0.03);
  }
  current += 1;
  if (current < TOTAL_QUESTIONS) {
    window.setTimeout(() => { locked = false; showQuestion(); }, 180);
  } else {
    window.setTimeout(() => endTest(false), 180);
  }
}

function getGradeLabel(percent) {
  if (percent >= 80) return "Excellent score";
  if (percent >= 65) return "Très bon score";
  if (percent >= 50) return "Bon score";
  if (percent >= 35) return "À poursuivre";
  return "Continuez à vous entraîner";
}

function renderCategoryResults() {
  categoryResults.replaceChildren();
  for (const category of categories) {
    const inCategory = questions.map((question, index) => ({ question, index })).filter((item) => item.question.category === category);
    const correct = inCategory.filter(({ question, index }) => answersGiven[index] === question.answer).length;
    const row = document.createElement("div");
    row.className = "category-row";
    const label = document.createElement("span");
    label.textContent = category;
    const value = document.createElement("strong");
    value.textContent = `${correct} / ${inCategory.length}`;
    const track = document.createElement("span");
    track.className = "category-meter";
    track.setAttribute("aria-label", `${category} : ${correct} bonne(s) réponse(s) sur ${inCategory.length}`);
    const fill = document.createElement("span");
    fill.style.width = `${inCategory.length ? correct / inCategory.length * 100 : 0}%`;
    track.append(fill);
    row.append(label, value, track);
    categoryResults.append(row);
  }
}

function renderReview() {
  reviewList.replaceChildren();
  questions.forEach((question, index) => {
    const chosen = answersGiven[index];
    const correct = chosen === question.answer;
    const card = document.createElement("article");
    card.className = `review-card ${correct ? "is-correct" : "is-wrong"}`;
    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${question.text}`;
    const category = document.createElement("span");
    category.className = "review-category";
    category.textContent = question.category;
    const response = document.createElement("p");
    response.textContent = `Votre réponse : ${chosen === undefined ? "Sans réponse" : question.options[chosen]}${correct ? " — Correct" : ` — Réponse attendue : ${question.options[question.answer]}`}`;
    const explanation = document.createElement("p");
    explanation.className = "review-explanation";
    explanation.textContent = question.explanation;
    card.append(category, heading, response, explanation);
    reviewList.append(card);
  });
}

function createConfettiBurst() {
  confetti.replaceChildren();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#8b5cf6", "#7dd3fc", "#fbbf24", "#34d399", "#f472b6"];
  for (let i = 0; i < 24; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 220}px`);
    piece.style.setProperty("--r", `${(Math.random() - 0.5) * 600}deg`);
    piece.style.animationDelay = `${Math.random() * 0.18}s`;
    confetti.append(piece);
  }
}

function endTest(timeExpired) {
  if (finished) return;
  finished = true;
  clearInterval(timerId);
  quiz.hidden = true;
  result.hidden = false;
  const percent = Math.round(score / TOTAL_QUESTIONS * 100);
  scoreValue.textContent = String(score);
  scorePercent.textContent = `${percent} %`;
  timeLeftResult.textContent = formatTime(timeLeft);
  resultBadge.textContent = getGradeLabel(percent);
  resultMessage.textContent = percent >= 80 ? "Très belle performance sur ces énigmes !" : percent >= 50 ? "Bon travail : vous avez réussi une bonne partie des défis." : "Merci d’avoir joué. Relisez les explications et retentez le défi quand vous le souhaitez.";
  timeMessage.textContent = timeExpired ? "Temps écoulé : le test s’est terminé automatiquement." : `Temps restant à la fin : ${formatTime(timeLeft)}.`;
  renderCategoryResults();
  renderReview();
  review.hidden = true;
  document.querySelector("#toggle-review").setAttribute("aria-expanded", "false");
  saveStatus.textContent = "";
  finalResult = { score, total: TOTAL_QUESTIONS, percent, timeLeft, date: new Date().toISOString(), timeExpired };
  if (percent >= 80) createConfettiBurst();
  if (soundEnabled) {
    ensureAudio();
    playTone(660, 0.15, "triangle");
    window.setTimeout(() => playTone(880, 0.12, "triangle"), 100);
  }
}

function startQuiz() {
  ensureAudio();
  current = 0;
  score = 0;
  answersGiven = [];
  timeLeft = TOTAL_SECONDS;
  finished = false;
  locked = false;
  updateTimer();
  intro.hidden = true;
  result.hidden = true;
  quiz.hidden = false;
  progressFill.style.width = "0%";
  startTimer();
  showQuestion();
}

function getHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveResult() {
  if (!finalResult) return;
  const history = getHistory();
  history.unshift(finalResult);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    saveStatus.textContent = "Résultat sauvegardé sur cet appareil.";
  } catch {
    saveStatus.textContent = "La sauvegarde locale est indisponible sur ce navigateur.";
  }
}

function getShareText() {
  const date = new Date(finalResult.date).toLocaleDateString("fr-FR");
  return `Mon résultat au quiz de logique TEST-QI : ${finalResult.score}/${finalResult.total} (${finalResult.percent} %), le ${date}. Ce quiz est un jeu et ne mesure pas le QI.`;
}

async function shareResult() {
  if (!finalResult) return;
  const text = getShareText();
  if (navigator.share) {
    try { await navigator.share({ title: "Mon résultat TEST-QI", text }); }
    catch (error) { if (error.name !== "AbortError") saveStatus.textContent = "Le partage a échoué. Vous pouvez sauvegarder le résultat."; }
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    saveStatus.textContent = "Résultat copié. Vous pouvez le coller dans votre message.";
  } catch {
    saveStatus.textContent = "Le partage n’est pas disponible dans ce navigateur.";
  }
}

function downloadResult() {
  if (!finalResult) return;
  const text = `${getShareText()}\nTemps restant : ${formatTime(finalResult.timeLeft)}\n\nRésultats par domaine :\n${categories.map((category) => {
    const total = questions.filter((question) => question.category === category).length;
    const correct = questions.reduce((sum, question, index) => sum + (question.category === category && answersGiven[index] === question.answer ? 1 : 0), 0);
    return `- ${category} : ${correct}/${total}`;
  }).join("\n")}\n\nCorrection complète disponible sur la page du quiz.\n`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resultat-test-qi-${new Date(finalResult.date).toISOString().slice(0, 10)}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  saveResult();
  saveStatus.textContent = "Résultat sauvegardé sur cet appareil et téléchargé.";
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = `Son : ${soundEnabled ? "ON" : "OFF"}`;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  if (soundEnabled) ensureAudio();
});
document.querySelector("#start").addEventListener("click", startQuiz);
document.querySelector("#restart").addEventListener("click", () => {
  clearInterval(timerId);
  confetti.replaceChildren();
  result.hidden = true;
  intro.hidden = false;
  timer.classList.remove("warning");
  timer.textContent = formatTime(TOTAL_SECONDS);
  finalResult = null;
});
document.querySelector("#share-result").addEventListener("click", shareResult);
document.querySelector("#save-result").addEventListener("click", downloadResult);
document.querySelector("#toggle-review").addEventListener("click", (event) => {
  review.hidden = !review.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!review.hidden));
  event.currentTarget.textContent = review.hidden ? "Voir les réponses" : "Masquer les réponses";
  if (!review.hidden) review.scrollIntoView({ behavior: "smooth", block: "start" });
});

updateTimer();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
