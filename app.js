const TOTAL_QUESTIONS = 30;
const QUESTIONS_PER_CATEGORY = 10;
const TOTAL_SECONDS = 30 * 60;
const HISTORY_KEY = "test-qi-results-v1";
const categories = ["Logique", "Calcul mental", "Observation visuelle"];

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeQuestion(category, text, correct, wrong, explanation, visual = "") {
  const choices = shuffle([{ text: String(correct), correct: true }, ...wrong.map((text) => ({ text: String(text), correct: false }))]);
  return { category, text, options: choices.map((choice) => choice.text), answer: choices.findIndex((choice) => choice.correct), explanation, visual };
}

function numberChoices(answer, offsets = [-2, -1, 1]) {
  return offsets.map((offset) => String(answer + offset));
}

function shapeSvg(shapes) {
  const colors = ["#7dd3fc", "#c084fc", "#34d399", "#fbbf24"];
  const elements = shapes.map((shape, i) => {
    const x = 35 + i * 82;
    const color = colors[i % colors.length];
    if (shape === "carré") return `<rect x='${x - 17}' y='28' width='34' height='34' rx='4' fill='${color}'/>`;
    if (shape === "cercle") return `<circle cx='${x}' cy='45' r='18' fill='${color}'/>`;
    if (shape === "triangle") return `<path d='M${x} 24 L${x + 20} 62 H${x - 20} Z' fill='${color}'/>`;
    return `<path d='M${x} 22 L${x + 21} 45 L${x} 68 L${x - 21} 45 Z' fill='${color}'/>`;
  }).join("");
  return `<svg viewBox='0 0 360 90' role='img' aria-label='Suite de formes géométriques'>${elements}</svg>`;
}

function arrowSvg(arrows) {
  const glyphs = ["↑", "→", "↓", "←"];
  const elements = arrows.map((direction, i) => `<text x='${36 + i * 82}' y='63' font-size='48' fill='${i % 2 ? "#c084fc" : "#7dd3fc"}'>${glyphs[direction]}</text>`).join("");
  return `<svg viewBox='0 0 360 90' role='img' aria-label='Suite de flèches orientées'>${elements}</svg>`;
}

function dotsSvg(counts) {
  const groups = counts.map((count, group) => {
    const startX = 28 + group * 82;
    return Array.from({ length: count }, (_, i) => `<circle cx='${startX + (i % 3) * 13}' cy='${32 + Math.floor(i / 3) * 14}' r='4.5' fill='${group % 2 ? "#c084fc" : "#7dd3fc"}'/>`).join("");
  }).join("");
  return `<svg viewBox='0 0 360 90' role='img' aria-label='Groupes de points en quantité croissante'>${groups}</svg>`;
}

function gridSvg(rows, cols) {
  const width = Math.min(42, 126 / cols);
  const height = Math.min(42, 126 / rows);
  const x0 = (150 - width * cols) / 2;
  const y0 = (150 - height * rows) / 2;
  let lines = "";
  for (let c = 0; c <= cols; c += 1) lines += `<path d='M${x0 + c * width} ${y0} V${y0 + rows * height}'/>`;
  for (let r = 0; r <= rows; r += 1) lines += `<path d='M${x0} ${y0 + r * height} H${x0 + cols * width}'/>`;
  return `<svg viewBox='0 0 150 150' role='img' aria-label='Grille de ${rows} rangées et ${cols} colonnes'> <g fill='none' stroke='#7dd3fc' stroke-width='3'>${lines}</g></svg>`;
}

function buildQuestionBank() {
  const bank = [];
  const nouns = ["Lumas", "Neris", "Pavos", "Sélans", "Tovins", "Mérals", "Dovés", "Rilons", "Félis", "Kavans"];

  for (let i = 0; i < 50; i += 1) {
    const mode = i % 5;
    if (mode === 0) {
      const a = 17 + i * 3;
      const b = 8 + (i * 7) % 29;
      const answer = a + b;
      bank.push(makeQuestion("Calcul mental", `Calculez mentalement : ${a} + ${b} = ?`, answer, numberChoices(answer), `${a} + ${b} = ${answer}.`));
    } else if (mode === 1) {
      const a = 6 + i;
      const b = 3 + (i % 8);
      const answer = a * b;
      bank.push(makeQuestion("Calcul mental", `Combien font ${a} × ${b} ?`, answer, numberChoices(answer), `${a} × ${b} = ${answer}.`));
    } else if (mode === 2) {
      const percent = [10, 20, 25, 50][Math.floor(i / 5) % 4];
      const base = 100 + 20 * i;
      const answer = base * percent / 100;
      bank.push(makeQuestion("Calcul mental", `Calculez ${percent} % de ${base}.`, answer, numberChoices(answer), `${percent} % de ${base} = ${base} × ${percent} ÷ 100 = ${answer}.`));
    } else if (mode === 3) {
      const divisor = 3 + (i % 9);
      const quotient = 12 + i;
      const dividend = divisor * quotient;
      bank.push(makeQuestion("Calcul mental", `Calculez ${dividend} ÷ ${divisor}.`, quotient, numberChoices(quotient), `${dividend} ÷ ${divisor} = ${quotient}.`));
    } else {
      const a = 11 + i;
      const b = 2 + i % 7;
      const answer = a + b * 2;
      bank.push(makeQuestion("Calcul mental", `Respectez les priorités : ${a} + ${b} × 2 = ?`, answer, numberChoices(answer), `La multiplication d’abord : ${b} × 2 = ${b * 2}, puis ${a} + ${b * 2} = ${answer}.`));
    }
  }

  for (let i = 0; i < 50; i += 1) {
    const mode = i % 5;
    if (mode === 0) {
      const start = 2 + i;
      const step = 2 + (i % 8);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      const answer = start + 4 * step;
      bank.push(makeQuestion("Logique", `Quel nombre suit la suite ${seq.join(", ")}, … ?`, answer, numberChoices(answer), `On ajoute ${step} à chaque étape ; le nombre suivant est ${answer}.`));
    } else if (mode === 1) {
      const start = 2 + i;
      const seq = [start, start * 2, start * 4, start * 8];
      const answer = start * 16;
      bank.push(makeQuestion("Logique", `Complétez la suite : ${seq.join(", ")}, …`, answer, numberChoices(answer), `Chaque terme est multiplié par 2 : ${seq[3]} × 2 = ${answer}.`));
    } else if (mode === 2) {
      const n = 2 + i;
      const seq = [n * n, (n + 1) ** 2, (n + 2) ** 2];
      const answer = (n + 3) ** 2;
      bank.push(makeQuestion("Logique", `Quel carré parfait vient ensuite : ${seq.join(", ")}, … ?`, answer, numberChoices(answer), `Ce sont des carrés consécutifs ; le suivant est ${n + 3}² = ${answer}.`));
    } else if (mode === 3) {
      const start = 1 + (i % 5);
      const step = 1 + (i % 3);
      const letters = Array.from({ length: 4 }, (_, j) => String.fromCharCode(65 + start - 1 + j * step));
      const next = String.fromCharCode(65 + start - 1 + 4 * step);
      const wrong = [String.fromCharCode(next.charCodeAt(0) - 2), String.fromCharCode(next.charCodeAt(0) - 1), String.fromCharCode(next.charCodeAt(0) + 1)];
      bank.push(makeQuestion("Logique", `Quelle lettre suit : ${letters.join(", ")}, … ?`, next, wrong, `On avance de ${step} lettre(s) à chaque fois ; la lettre suivante est ${next}.`));
    } else {
      const a = nouns[i % nouns.length];
      const b = nouns[(i + 3) % nouns.length];
      const c = nouns[(i + 6) % nouns.length];
      bank.push(makeQuestion("Logique", `Tous les ${a} sont des ${b}. Tous les ${b} sont des ${c}. Quelle conclusion est certaine ?`, `Tous les ${a} sont des ${c}`, [`Tous les ${c} sont des ${a}`, `Aucun ${a} n’est un ${c}`, `Tous les ${b} sont des ${a}`], `La relation est transitive : chaque ${a} est un ${b}, et chaque ${b} est un ${c}.`));
    }
  }

  const shapes = ["carré", "cercle", "triangle", "losange"];
  const shapeLabels = ["Carré", "Cercle", "Triangle", "Losange"];
  for (let i = 0; i < 10; i += 1) {
    const first = i % shapes.length;
    const second = (first + 1) % shapes.length;
    const series = [shapes[first], shapes[second], shapes[first], shapes[second]];
    bank.push(makeQuestion("Observation visuelle", "Quelle forme complète l’alternance ?", shapeLabels[first], shapeLabels.filter((shape) => shape !== shapeLabels[first]), "Les deux formes alternent ; la prochaine est identique à la première.", shapeSvg(series)));
  }
  const arrowLabels = ["↑", "→", "↓", "←"];
  for (let i = 0; i < 10; i += 1) {
    const start = i % 4;
    const turn = i % 2 ? 3 : 1;
    const sequence = Array.from({ length: 4 }, (_, step) => (start + step * turn + 8) % 4);
    const answer = arrowLabels[(start + 4 * turn) % 4];
    bank.push(makeQuestion("Observation visuelle", "Quelle flèche vient ensuite ?", answer, arrowLabels.filter((arrow) => arrow !== answer), `La flèche tourne d’un quart de tour ${turn === 1 ? "dans le sens horaire" : "dans le sens antihoraire"} à chaque étape.`, arrowSvg(sequence)));
  }
  for (let i = 0; i < 10; i += 1) {
    const start = 1 + i;
    const counts = [start, start + 1, start + 2];
    const answer = start + 3;
    bank.push(makeQuestion("Observation visuelle", "Combien de points aura le groupe suivant ?", answer, [answer - 2, answer - 1, answer + 1], `Le nombre de points augmente de un : après ${counts.join(", ")}, il y en aura ${answer}.`, dotsSvg(counts)));
  }
  for (let i = 0; i < 10; i += 1) {
    const rows = 2 + (i % 3);
    const cols = 2 + (Math.floor(i / 3) % 3);
    const answer = rows * cols;
    bank.push(makeQuestion("Observation visuelle", `Combien de petites cases contient cette grille de ${rows} rangées et ${cols} colonnes ?`, answer, [answer - 1, answer + 1, answer + rows], `${rows} rangées × ${cols} colonnes = ${answer} petites cases.`, gridSvg(rows, cols)));
  }
  for (let i = 0; i < 10; i += 1) {
    const start = i % 4;
    const answer = arrowLabels[(start + 2) % 4];
    bank.push(makeQuestion("Observation visuelle", "Quel symbole est le reflet horizontal de la flèche modèle ?", answer, arrowLabels.filter((arrow) => arrow !== answer), "Un reflet horizontal inverse la direction gauche-droite : la flèche pointe dans le sens opposé.", arrowSvg([start, (start + 1) % 4, (start + 2) % 4, (start + 3) % 4])));
  }

  return bank;
}

const questionBank = buildQuestionBank();
if (questionBank.length !== 150) throw new Error(`La réserve doit contenir 150 questions, contient ${questionBank.length}.`);

function drawQuizQuestions() {
  return categories.flatMap((category) => shuffle(questionBank.filter((question) => question.category === category)).slice(0, QUESTIONS_PER_CATEGORY)).sort(() => Math.random() - 0.5);
}

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

let quizQuestions = [];
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
  const question = quizQuestions[current];
  const pct = Math.round(current / TOTAL_QUESTIONS * 100);
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
  const question = quizQuestions[current];
  answersGiven.push(index);
  if (index === question.answer) {
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
    const indices = quizQuestions.map((question, index) => ({ question, index })).filter((item) => item.question.category === category);
    const correct = indices.filter(({ question, index }) => answersGiven[index] === question.answer).length;
    const row = document.createElement("div");
    row.className = "category-row";
    const label = document.createElement("span"); label.textContent = category;
    const value = document.createElement("strong"); value.textContent = `${correct} / ${indices.length}`;
    const track = document.createElement("span"); track.className = "category-meter";
    track.setAttribute("aria-label", `${category} : ${correct} bonne(s) réponse(s) sur ${indices.length}`);
    const fill = document.createElement("span"); fill.style.width = `${correct / indices.length * 100}%`;
    track.append(fill); row.append(label, value, track); categoryResults.append(row);
  }
}

function renderReview() {
  reviewList.replaceChildren();
  quizQuestions.forEach((question, index) => {
    const chosen = answersGiven[index];
    const correct = chosen === question.answer;
    const card = document.createElement("article");
    card.className = `review-card ${correct ? "is-correct" : "is-wrong"}`;
    const category = document.createElement("span"); category.className = "review-category"; category.textContent = question.category;
    const heading = document.createElement("h3"); heading.textContent = `${index + 1}. ${question.text}`;
    const response = document.createElement("p");
    response.textContent = `Votre réponse : ${chosen === undefined ? "Sans réponse" : question.options[chosen]}${correct ? " — Correct" : ` — Réponse attendue : ${question.options[question.answer]}`}`;
    const explanation = document.createElement("p"); explanation.className = "review-explanation"; explanation.textContent = question.explanation;
    card.append(category, heading);
    if (question.visual) {
      const figure = document.createElement("div"); figure.className = "review-visual"; figure.innerHTML = question.visual; card.append(figure);
    }
    card.append(response, explanation);
    reviewList.append(card);
  });
}

function createConfettiBurst() {
  confetti.replaceChildren();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#8b5cf6", "#7dd3fc", "#fbbf24", "#34d399", "#f472b6"];
  for (let i = 0; i < 24; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece"; piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length]; piece.style.setProperty("--x", `${(Math.random() - 0.5) * 220}px`);
    piece.style.setProperty("--r", `${(Math.random() - 0.5) * 600}deg`); piece.style.animationDelay = `${Math.random() * 0.18}s`;
    confetti.append(piece);
  }
}

function endTest(timeExpired) {
  if (finished) return;
  finished = true;
  clearInterval(timerId);
  quiz.hidden = true; result.hidden = false;
  const percent = Math.round(score / TOTAL_QUESTIONS * 100);
  scoreValue.textContent = String(score); scorePercent.textContent = `${percent} %`;
  timeLeftResult.textContent = formatTime(timeLeft); resultBadge.textContent = getGradeLabel(percent);
  resultMessage.textContent = percent >= 80 ? "Très belle performance sur ces énigmes !" : percent >= 50 ? "Bon travail : vous avez réussi une bonne partie des défis." : "Merci d’avoir joué. Relisez les explications et retentez le défi quand vous le souhaitez.";
  timeMessage.textContent = timeExpired ? "Temps écoulé : le test s’est terminé automatiquement." : `Temps restant à la fin : ${formatTime(timeLeft)}.`;
  renderCategoryResults(); renderReview();
  review.hidden = true;
  document.querySelector("#toggle-review").setAttribute("aria-expanded", "false");
  document.querySelector("#toggle-review").textContent = "Voir la correction";
  saveStatus.textContent = "";
  finalResult = { score, total: TOTAL_QUESTIONS, percent, timeLeft, date: new Date().toISOString(), timeExpired };
  if (percent >= 80) createConfettiBurst();
  if (soundEnabled) { ensureAudio(); playTone(660, 0.15, "triangle"); window.setTimeout(() => playTone(880, 0.12, "triangle"), 100); }
}

function startQuiz() {
  ensureAudio();
  quizQuestions = drawQuizQuestions();
  current = 0; score = 0; answersGiven = []; timeLeft = TOTAL_SECONDS; finished = false; locked = false;
  updateTimer(); intro.hidden = true; result.hidden = true; quiz.hidden = false;
  progressFill.style.width = "0%"; startTimer(); showQuestion();
}

function getHistory() {
  try { const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}

function saveResult() {
  if (!finalResult) return;
  const history = getHistory(); history.unshift(finalResult);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20))); saveStatus.textContent = "Résultat sauvegardé sur cet appareil."; }
  catch { saveStatus.textContent = "La sauvegarde locale est indisponible sur ce navigateur."; }
}

function getShareText() {
  const date = new Date(finalResult.date).toLocaleDateString("fr-FR");
  return `Mon résultat au quiz TEST-QI : ${finalResult.score}/${finalResult.total} (${finalResult.percent} %), le ${date}. Ce quiz est un jeu et ne mesure pas le QI.`;
}

async function shareResult() {
  if (!finalResult) return;
  const text = getShareText();
  if (navigator.share) {
    try { await navigator.share({ title: "Mon résultat TEST-QI", text }); }
    catch (error) { if (error.name !== "AbortError") saveStatus.textContent = "Le partage a échoué. Vous pouvez sauvegarder le résultat."; }
    return;
  }
  try { await navigator.clipboard.writeText(text); saveStatus.textContent = "Résultat copié. Vous pouvez le coller dans votre message."; }
  catch { saveStatus.textContent = "Le partage n’est pas disponible dans ce navigateur."; }
}

function downloadResult() {
  if (!finalResult) return;
  const text = `${getShareText()}\nTemps restant : ${formatTime(finalResult.timeLeft)}\n\nRésultats par domaine :\n${categories.map((category) => {
    const indices = quizQuestions.map((question, index) => ({ question, index })).filter((item) => item.question.category === category);
    const correct = indices.filter(({ question, index }) => answersGiven[index] === question.answer).length;
    return `- ${category} : ${correct}/${indices.length}`;
  }).join("\n")}\n`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url;
  link.download = `resultat-test-qi-${new Date(finalResult.date).toISOString().slice(0, 10)}.txt`;
  document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  saveResult(); saveStatus.textContent = "Résultat sauvegardé sur cet appareil et téléchargé.";
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled; soundToggle.textContent = `Son : ${soundEnabled ? "ON" : "OFF"}`;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled)); if (soundEnabled) ensureAudio();
});
document.querySelector("#start").addEventListener("click", startQuiz);
document.querySelector("#restart").addEventListener("click", () => {
  clearInterval(timerId); confetti.replaceChildren(); result.hidden = true; intro.hidden = false;
  timer.classList.remove("warning"); timer.textContent = formatTime(TOTAL_SECONDS); finalResult = null;
});
document.querySelector("#share-result").addEventListener("click", shareResult);
document.querySelector("#save-result").addEventListener("click", downloadResult);
document.querySelector("#toggle-review").addEventListener("click", (event) => {
  review.hidden = !review.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!review.hidden));
  event.currentTarget.textContent = review.hidden ? "Voir la correction" : "Masquer la correction";
  if (!review.hidden) review.scrollIntoView({ behavior: "smooth", block: "start" });
});

updateTimer();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
