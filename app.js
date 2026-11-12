const TOTAL = 30;
const PER_CATEGORY = 10;
const DURATION = 30 * 60;
const CATEGORIES = ["Logique", "Calcul mental", "Observation visuelle"];
const LEVELS = ["decouverte", "intermediaire", "expert"];
const HISTORY_KEY = "test-qi-mobile-results-v1";

const $ = (selector) => document.querySelector(selector);
const intro = $("#intro");
const quiz = $("#quiz");
const result = $("#result");
const timer = $("#timer");
const questionTitle = $("#question-title");
const questionVisual = $("#question-visual");
const answersElement = $("#answers");
const progressTrack = $("#progress-track");
const progressFill = $("#progress-fill");
const saveStatus = $("#save-status");

let bank = [];
let session = [];
let responses = [];
let index = 0;
let score = 0;
let deadline = 0;
let tick = null;
let ended = false;
let locked = false;
let soundEnabled = false;
let audioContext = null;
let playerName = "";
let level = "intermediaire";
let completedResult = null;

function shuffle(items) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function choices(category, difficulty, text, correct, distractors, explanation, visual = "") {
  const unique = [...new Set(distractors.map(String).filter((value) => value !== String(correct)))];
  for (let n = 1; unique.length < 3; n += 1) {
    const fallback = String(Number(correct) + n + 3);
    if (fallback !== String(correct) && !unique.includes(fallback)) unique.push(fallback);
  }
  const options = shuffle([{ value: String(correct), correct: true }, ...unique.slice(0, 3).map((value) => ({ value, correct: false }))]);
  return { category, difficulty, text, options: options.map((item) => item.value), answer: options.findIndex((item) => item.correct), explanation, visual };
}

function numberChoices(answer) {
  const candidates = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 5, answer - 5, answer * 2, Math.floor(answer / 2), answer + 10, answer - 10];
  return [...new Set(candidates.filter((value) => Number.isFinite(value) && value >= 0 && value !== answer))].slice(0, 3);
}

function makeMathQuestion(level, i) {
  const shift = LEVELS.indexOf(level) * 5;
  const mode = i % 6;
  if (mode === 0) {
    const a = 18 + i * 3 + shift * 2; const b = 13 + (i * 7) % 39 + shift;
    const answer = a + b;
    return choices("Calcul mental", level, `Calculez ${a} + ${b}.`, answer, numberChoices(answer), `${a} + ${b} = ${answer}.`);
  }
  if (mode === 1) {
    const a = 90 + i * 4 + shift * 3; const b = 17 + (i * 5) % 47 + shift;
    const answer = a - b;
    return choices("Calcul mental", level, `Calculez ${a} − ${b}.`, answer, numberChoices(answer), `${a} − ${b} = ${answer}.`);
  }
  if (mode === 2) {
    const a = 6 + (i % 13) + shift; const b = 4 + ((i * 3) % 9);
    const answer = a * b;
    return choices("Calcul mental", level, `Combien font ${a} × ${b} ?`, answer, numberChoices(answer), `${a} × ${b} = ${answer}.`);
  }
  if (mode === 3) {
    const divisor = 3 + (i % 10); const answer = 12 + i + shift;
    return choices("Calcul mental", level, `Calculez ${divisor * answer} ÷ ${divisor}.`, answer, numberChoices(answer), `${divisor * answer} ÷ ${divisor} = ${answer}.`);
  }
  if (mode === 4) {
    const percent = [10, 20, 25, 50][i % 4]; const base = (80 + i * 8 + shift * 4);
    const answer = base * percent / 100;
    return choices("Calcul mental", level, `Combien font ${percent} % de ${base} ?`, answer, numberChoices(answer), `${base} × ${percent} ÷ 100 = ${answer}.`);
  }
  const divisor = 2 + i % 5; const answer = 9 + i + shift; const total = divisor * answer;
  return choices("Calcul mental", level, `Quelle est la ${divisor === 2 ? "moitié" : divisor === 4 ? "quart" : `${divisor}e partie`} de ${total} ?`, answer, numberChoices(answer), `${total} ÷ ${divisor} = ${answer}.`);
}

function makeLogicQuestion(level, i) {
  const shift = LEVELS.indexOf(level) * 4;
  const mode = i % 4;
  if (mode === 0) {
    const start = 3 + i + shift; const step = 2 + (i % 8) + shift;
    const sequence = [0, 1, 2, 3].map((n) => start + n * step); const answer = start + 4 * step;
    return choices("Logique", level, `Quel nombre suit : ${sequence.join(", ")}, … ?`, answer, numberChoices(answer), `On ajoute ${step} à chaque terme : ${sequence[3]} + ${step} = ${answer}.`);
  }
  if (mode === 1) {
    const start = 2 + (i % 9) + shift; const sequence = [start, start * 2, start * 4, start * 8]; const answer = start * 16;
    return choices("Logique", level, `Complétez la suite : ${sequence.join(", ")}, …`, answer, numberChoices(answer), `Chaque terme est multiplié par 2 ; ${sequence[3]} × 2 = ${answer}.`);
  }
  if (mode === 2) {
    const start = 2 + i + shift; const sequence = [start ** 2, (start + 1) ** 2, (start + 2) ** 2]; const answer = (start + 3) ** 2;
    return choices("Logique", level, `Quel carré parfait suit ${sequence.join(", ")} ?`, answer, numberChoices(answer), `Les nombres sont des carrés consécutifs ; ${start + 3}² = ${answer}.`);
  }
  const names = ["Nors", "Vels", "Tims", "Lumas", "Pavos", "Rilons", "Dovés", "Mérals", "Sélans", "Kavans"];
  const a = names[i % names.length]; const b = names[(i + 3) % names.length]; const c = names[(i + 6) % names.length];
  return choices("Logique", level, `Tous les ${a} sont des ${b}. Tous les ${b} sont des ${c}. Quelle conclusion suit ?`, `Tous les ${a} sont des ${c}`, [`Tous les ${c} sont des ${a}`, `Aucun ${a} n’est un ${c}`, `Tous les ${b} sont des ${a}`], `La relation est transitive : tous les ${a} sont des ${b}, et tous les ${b} des ${c}.`);
}

function visualQuestion(level, i) {
  const shapes = ["carré", "cercle", "triangle", "losange"];
  const labels = ["Carré", "Cercle", "Triangle", "Losange"];
  const first = i % 4; const second = (first + 1 + (i % 3)) % 4;
  const draw = [
    (x, color) => `<rect x="${x - 15}" y="28" width="30" height="30" rx="4" fill="${color}"/>`,
    (x, color) => `<circle cx="${x}" cy="43" r="16" fill="${color}"/>`,
    (x, color) => `<path d="M${x} 23 L${x + 17} 57 H${x - 17} Z" fill="${color}"/>`,
    (x, color) => `<path d="M${x} 22 L${x + 18} 43 L${x} 64 L${x - 18} 43 Z" fill="${color}"/>`
  ];
  const series = [first, second, first, second];
  const svg = `<svg viewBox="0 0 360 86" role="img" aria-label="Suite alternée de formes">${series.map((shape, position) => draw[shape](35 + position * 82, position % 2 ? "#c084fc" : "#38bdf8")).join("")}</svg>`;
  return choices("Observation visuelle", level, "Quelle forme complète cette alternance ?", labels[first], labels.filter((_, n) => n !== first), `Les deux formes alternent : la suivante reprend la première (${shapes[first]}).`, svg);
}

function buildBank() {
  const result = [];
  const levelCounts = { decouverte: 17, intermediaire: 17, expert: 16 };
  for (const level of LEVELS) {
    for (let i = 0; i < levelCounts[level]; i += 1) {
      result.push(makeMathQuestion(level, i));
      result.push(makeLogicQuestion(level, i));
      result.push(visualQuestion(level, i));
    }
  }
  return result;
}

bank = buildBank();
if (bank.length !== 150) throw new Error(`Erreur de banque : ${bank.length} questions au lieu de 150.`);

function drawSession() {
  const drawn = CATEGORIES.flatMap((category) => shuffle(bank.filter((question) => question.category === category && question.difficulty === level)).slice(0, PER_CATEGORY));
  if (drawn.length !== TOTAL) throw new Error("Impossible de sélectionner 30 questions pour ce niveau.");
  return shuffle(drawn);
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function sound(frequency, duration, type = "sine") {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.025, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
}

function tickTimer() {
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  timer.textContent = formatTime(remaining);
  timer.classList.toggle("warning", remaining <= 30);
  if (remaining === 0 && !ended) finish(true);
}

function showQuestion() {
  const question = session[index];
  const progress = Math.round(index / TOTAL * 100);
  $("#question-count").textContent = `Question ${index + 1} sur ${TOTAL}`;
  $("#progress-label").textContent = `${progress} %`;
  progressTrack.setAttribute("aria-valuenow", String(index)); progressFill.style.width = `${progress}%`;
  $("#category-label").textContent = question.category; questionTitle.textContent = question.text;
  if (question.visual) { questionVisual.innerHTML = question.visual; questionVisual.hidden = false; }
  else { questionVisual.replaceChildren(); questionVisual.hidden = true; }
  answersElement.replaceChildren();
  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "answer";
    const badge = document.createElement("span"); badge.className = "answer-letter"; badge.setAttribute("aria-hidden", "true"); badge.textContent = String.fromCharCode(65 + optionIndex);
    const text = document.createElement("span"); text.textContent = option;
    button.append(badge, text); button.addEventListener("click", () => answer(optionIndex)); answersElement.append(button);
  });
  questionTitle.focus({ preventScroll: true });
}

function answer(optionIndex) {
  if (locked || ended) return;
  locked = true; responses[index] = optionIndex;
  if (optionIndex === session[index].answer) { score += 1; sound(740, 0.1, "triangle"); } else sound(210, 0.12, "sine");
  index += 1;
  if (index >= TOTAL) window.setTimeout(() => finish(false), 120);
  else window.setTimeout(() => { if (!ended) { locked = false; showQuestion(); } }, 120);
}

function renderBreakdown() {
  const container = $("#category-results"); container.replaceChildren();
  for (const category of CATEGORIES) {
    const entries = session.map((question, position) => ({ question, position })).filter((item) => item.question.category === category);
    const correct = entries.filter(({ question, position }) => responses[position] === question.answer).length;
    const row = document.createElement("div"); row.className = "breakdown-row";
    const name = document.createElement("span"); name.textContent = category;
    const amount = document.createElement("strong"); amount.textContent = `${correct} / ${entries.length}`;
    const meter = document.createElement("span"); meter.className = "meter";
    const fill = document.createElement("span"); fill.style.width = `${correct / entries.length * 100}%`; meter.append(fill);
    row.append(name, amount, meter); container.append(row);
  }
}

function renderReview() {
  const container = $("#review-list"); container.replaceChildren();
  session.forEach((question, position) => {
    const chosen = responses[position]; const correct = chosen === question.answer;
    const card = document.createElement("article"); card.className = `review-card ${correct ? "correct" : "incorrect"}`;
    const category = document.createElement("span"); category.className = "review-category"; category.textContent = question.category;
    const heading = document.createElement("h3"); heading.textContent = `${position + 1}. ${question.text}`; card.append(category, heading);
    if (question.visual) { const image = document.createElement("div"); image.className = "visual review-visual"; image.innerHTML = question.visual; card.append(image); }
    const chosenText = document.createElement("p"); chosenText.textContent = `Votre réponse : ${chosen === undefined ? "Sans réponse" : question.options[chosen]}${correct ? " · Correcte" : ` · Réponse attendue : ${question.options[question.answer]}`}`;
    const explanation = document.createElement("p"); explanation.className = "explanation"; explanation.textContent = question.explanation;
    card.append(chosenText, explanation); container.append(card);
  });
}

function finish(timeExpired) {
  if (ended) return;
  ended = true; clearInterval(tick); tickTimer();
  quiz.hidden = true; result.hidden = false;
  const percent = Math.round(score / TOTAL * 100);
  $("#result-title").textContent = playerName ? `Bravo, ${playerName} !` : "Votre résultat";
  $("#result-label").textContent = percent >= 80 ? "Très belle partie" : percent >= 60 ? "Bonne partie" : percent >= 40 ? "Partie encourageante" : "Merci d’avoir joué";
  $("#score-value").textContent = String(score); $("#score-percent").textContent = `${percent} % de bonnes réponses`;
  $("#result-message").textContent = `Difficulté ${level === "decouverte" ? "Découverte" : level === "expert" ? "Expert" : "Intermédiaire"} · ${score} bonne(s) réponse(s) sur ${TOTAL}.`;
  $("#time-message").textContent = timeExpired ? "Le temps est écoulé." : `Temps restant : ${formatTime(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))}.`;
  renderBreakdown(); renderReview(); $("#review").hidden = true;
  $("#toggle-review").textContent = "Voir la correction"; $("#toggle-review").setAttribute("aria-expanded", "false");
  saveStatus.textContent = "";
  completedResult = { score, percent, difficulty, date: new Date().toISOString(), timeExpired };
  if (soundEnabled) { sound(660, 0.12, "triangle"); window.setTimeout(() => sound(880, 0.12, "triangle"), 120); }
}

function start() {
  playerName = $("#player-name").value.trim().replace(/[<>]/g, "").slice(0, 24);
  level = LEVELS.includes($("#difficulty").value) ? $("#difficulty").value : "intermediaire";
  session = drawSession(); responses = Array(TOTAL).fill(undefined); index = 0; score = 0; ended = false; locked = false; completedResult = null;
  intro.hidden = true; result.hidden = true; quiz.hidden = false;
  deadline = Date.now() + DURATION * 1000; tickTimer(); clearInterval(tick); tick = window.setInterval(tickTimer, 500);
  showQuestion();
}

function shareText() {
  const domains = CATEGORIES.map((category) => {
    const rows = session.map((question, position) => ({ question, position })).filter((item) => item.question.category === category);
    const correct = rows.filter(({ question, position }) => responses[position] === question.answer).length;
    return `${category} ${correct}/${rows.length}`;
  }).join(" · ");
  return `${playerName ? `${playerName} — ` : ""}Mon résultat au quiz TEST-QI : ${score}/30 (${Math.round(score / TOTAL * 100)} %). ${domains}. Quiz récréatif, ce n’est pas un score de QI.`;
}

async function share() {
  if (!completedResult) return;
  const text = shareText();
  if (navigator.share) {
    try { await navigator.share({ title: "Mon résultat au quiz", text }); return; }
    catch (error) { if (error.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(text); saveStatus.textContent = "Résultat copié pour le partager."; }
  catch { saveStatus.textContent = text; }
}

function save() {
  if (!completedResult) return;
  const report = `${shareText()}\nDate : ${new Date(completedResult.date).toLocaleString("fr-FR")}\nTemps restant : ${timer.textContent}\n\nCe quiz est récréatif et ne mesure pas le QI.\n`;
  let locallySaved = false;
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history.unshift({ ...completedResult, name: playerName || undefined });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20))); locallySaved = true;
  } catch { /* The downloadable report is still available. */ }
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = `resultat-quiz-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  saveStatus.textContent = locallySaved ? "Fichier téléchargé et résultat conservé dans ce navigateur." : "Fichier téléchargé. La sauvegarde du navigateur n’est pas disponible.";
}

$("#start").addEventListener("click", start);
$("#restart").addEventListener("click", () => { clearInterval(tick); result.hidden = true; intro.hidden = false; timer.textContent = "30:00"; timer.classList.remove("warning"); });
$("#share-result").addEventListener("click", share);
$("#save-result").addEventListener("click", save);
$("#toggle-review").addEventListener("click", (event) => {
  const open = $("#review").hidden; $("#review").hidden = !open;
  event.currentTarget.setAttribute("aria-expanded", String(open)); event.currentTarget.textContent = open ? "Masquer la correction" : "Voir la correction";
  if (open) $("#review").scrollIntoView({ behavior: "smooth", block: "start" });
});
soundToggle.addEventListener("click", () => { soundEnabled = !soundEnabled; soundToggle.textContent = `Son : ${soundEnabled ? "ON" : "OFF"}`; soundToggle.setAttribute("aria-pressed", String(soundEnabled)); if (soundEnabled) sound(520, 0.07); });

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
