const TOTAL_QUESTIONS = 30;
const QUESTIONS_PER_CATEGORY = 10;
const TEST_DURATION_SECONDS = 30 * 60;
const HISTORY_KEY = "test-qi-history-v2";
const CATEGORIES = window.TEST_QUESTION_CATEGORIES;
const QUESTION_BANK = window.TEST_QUESTION_BANK;
const $ = (selector) => document.querySelector(selector);

if (!Array.isArray(QUESTION_BANK) || QUESTION_BANK.length !== 150) {
  throw new Error("La réserve du quiz doit contenir exactement 150 questions.");
}
for (const category of CATEGORIES) {
  for (const difficulty of ["decouverte", "intermediaire", "expert"]) {
    const count = QUESTION_BANK.filter((question) => question.category === category && question.difficulty === difficulty).length;
    if (count < QUESTIONS_PER_CATEGORY) throw new Error(`Réserve insuffisante : ${category}, niveau ${difficulty}.`);
  }
}

const intro = $("#intro");
const quiz = $("#quiz");
const result = $("#result");
const timer = $("#timer");
const nameInput = $("#player-name");
const difficultyInput = $("#difficulty");
const soundToggle = $("#sound-toggle");
const questionCount = $("#question-count");
const progressLabel = $("#progress-label");
const progressTrack = $("#progress-track");
const progressFill = $("#progress-fill");
const categoryLabel = $("#category-label");
const questionTitle = $("#question-title");
const questionVisual = $("#question-visual");
const answersElement = $("#answers");
const categoryResults = $("#category-results");
const review = $("#review");
const reviewList = $("#review-list");
const saveStatus = $("#save-status");

let sessionQuestions = [];
let selectedAnswers = [];
let currentQuestion = 0;
let score = 0;
let secondsLeft = TEST_DURATION_SECONDS;
let deadline = 0;
let timerId = null;
let locked = false;
let finished = false;
let soundEnabled = false;
let audioContext = null;
let resultData = null;
let playerName = "";
let difficulty = "intermediaire";
let resultSaved = false;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function drawQuestions() {
  const questions = CATEGORIES.flatMap((category) => {
    const available = QUESTION_BANK.filter((question) => question.category === category && question.difficulty === difficulty);
    return shuffle(available).slice(0, QUESTIONS_PER_CATEGORY);
  });
  if (questions.length !== TOTAL_QUESTIONS) throw new Error("Impossible de préparer 30 questions pour ce niveau.");
  return shuffle(questions);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function playTone(frequency, duration, type = "sine") {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.03, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function updateTimer() {
  secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  timer.textContent = formatTime(secondsLeft);
  timer.classList.toggle("warning", secondsLeft <= 30);
  if (secondsLeft === 0 && !finished) endQuiz(true);
}

function startTimer() {
  clearInterval(timerId);
  deadline = Date.now() + TEST_DURATION_SECONDS * 1000;
  updateTimer();
  timerId = window.setInterval(updateTimer, 250);
}

function renderQuestion() {
  const question = sessionQuestions[currentQuestion];
  const percent = Math.round((currentQuestion / TOTAL_QUESTIONS) * 100);
  questionCount.textContent = `Question ${currentQuestion + 1} sur ${TOTAL_QUESTIONS}`;
  progressLabel.textContent = `${percent} %`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
  progressFill.style.width = `${percent}%`;
  categoryLabel.textContent = question.category;
  questionTitle.textContent = question.text;

  if (question.visual) {
    questionVisual.innerHTML = question.visual;
    questionVisual.hidden = false;
  } else {
    questionVisual.replaceChildren();
    questionVisual.hidden = true;
  }

  answersElement.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.textContent = option;
    button.append(letter, label);
    button.addEventListener("click", () => chooseAnswer(index));
    answersElement.append(button);
  });
  questionTitle.focus({ preventScroll: true });
}

function chooseAnswer(answerIndex) {
  if (locked || finished) return;
  locked = true;
  const question = sessionQuestions[currentQuestion];
  selectedAnswers[currentQuestion] = answerIndex;
  if (answerIndex === question.answer) {
    score += 1;
    playTone(740, 0.12, "triangle");
  } else {
    playTone(210, 0.15, "sawtooth");
  }

  currentQuestion += 1;
  if (currentQuestion < TOTAL_QUESTIONS) {
    window.setTimeout(() => {
      if (finished) return;
      locked = false;
      renderQuestion();
    }, 140);
  } else {
    window.setTimeout(() => endQuiz(false), 140);
  }
}

function difficultyLabel() {
  return difficulty === "decouverte" ? "Découverte" : difficulty === "expert" ? "Expert" : "Intermédiaire";
}

function renderCategoryResults() {
  categoryResults.replaceChildren();
  for (const category of CATEGORIES) {
    const indexedQuestions = sessionQuestions
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => question.category === category);
    const correct = indexedQuestions.filter(({ question, index }) => selectedAnswers[index] === question.answer).length;
    const row = document.createElement("div");
    row.className = "category-row";
    const label = document.createElement("span");
    label.textContent = category;
    const value = document.createElement("strong");
    value.textContent = `${correct} / ${indexedQuestions.length}`;
    const meter = document.createElement("span");
    meter.className = "category-meter";
    meter.setAttribute("aria-label", `${category} : ${correct} bonnes réponses sur ${indexedQuestions.length}`);
    const fill = document.createElement("span");
    fill.style.width = `${(correct / indexedQuestions.length) * 100}%`;
    meter.append(fill);
    row.append(label, value, meter);
    categoryResults.append(row);
  }
}

function renderCorrections() {
  reviewList.replaceChildren();
  sessionQuestions.forEach((question, index) => {
    const selected = selectedAnswers[index];
    const correct = selected === question.answer;
    const card = document.createElement("article");
    card.className = `review-card ${correct ? "is-correct" : "is-wrong"}`;
    const category = document.createElement("span");
    category.className = "review-category";
    category.textContent = question.category;
    const heading = document.createElement("h3");
    heading.textContent = `${index + 1}. ${question.text}`;
    card.append(category, heading);
    if (question.visual) {
      const image = document.createElement("div");
      image.className = "review-visual";
      image.innerHTML = question.visual;
      card.append(image);
    }
    const response = document.createElement("p");
    response.textContent = `Votre réponse : ${selected === undefined ? "Sans réponse" : question.options[selected]}${correct ? " — correcte" : ` — bonne réponse : ${question.options[question.answer]}`}`;
    const explanation = document.createElement("p");
    explanation.className = "review-explanation";
    explanation.textContent = question.explanation;
    card.append(response, explanation);
    reviewList.append(card);
  });
}

function finishMessage(percent) {
  if (percent >= 85) return "Excellent résultat sur cette partie !";
  if (percent >= 65) return "Très bon travail : vous avez réussi la plupart des défis.";
  if (percent >= 40) return "Bien joué. La correction peut vous aider à progresser.";
  return "Merci d’avoir joué. Consultez les explications et retentez une nouvelle série.";
}

function endQuiz(timeExpired) {
  if (finished) return;
  finished = true;
  clearInterval(timerId);
  secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  timer.textContent = formatTime(secondsLeft);
  quiz.hidden = true;
  result.hidden = false;

  const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
  $("#result-title").textContent = playerName ? `Bravo, ${playerName} !` : "Votre résultat";
  $("#result-badge").textContent = finishMessage(percent);
  $("#score-value").textContent = String(score);
  $("#score-percent").textContent = `${percent} %`;
  $("#time-left-result").textContent = formatTime(secondsLeft);
  $("#result-message").textContent = `Niveau ${difficultyLabel()} : ${score} bonne(s) réponse(s) sur ${TOTAL_QUESTIONS}.`;
  $("#time-message").textContent = timeExpired ? "Temps écoulé : la partie est terminée." : `Temps restant : ${formatTime(secondsLeft)}.`;
  renderCategoryResults();
  renderCorrections();
  review.hidden = true;
  $("#toggle-review").textContent = "Voir la correction";
  $("#toggle-review").setAttribute("aria-expanded", "false");
  saveStatus.textContent = "";
  resultSaved = false;
  resultData = {
    score,
    total: TOTAL_QUESTIONS,
    percent,
    secondsLeft,
    difficulty: difficultyLabel(),
    date: new Date().toISOString()
  };
  if (soundEnabled) {
    playTone(660, 0.14, "triangle");
    window.setTimeout(() => playTone(880, 0.12, "triangle"), 120);
  }
}

function startQuiz() {
  playerName = nameInput.value.trim().replace(/[<>]/g, "").slice(0, 24);
  difficulty = difficultyInput.value;
  sessionQuestions = drawQuestions();
  selectedAnswers = Array(TOTAL_QUESTIONS).fill(undefined);
  currentQuestion = 0;
  score = 0;
  secondsLeft = TEST_DURATION_SECONDS;
  locked = false;
  finished = false;
  resultData = null;
  intro.hidden = true;
  result.hidden = true;
  quiz.hidden = false;
  progressFill.style.width = "0%";
  startTimer();
  renderQuestion();
}

function categorySummary() {
  return CATEGORIES.map((category) => {
    const entries = sessionQuestions.map((question, index) => ({ question, index })).filter(({ question }) => question.category === category);
    const correct = entries.filter(({ question, index }) => selectedAnswers[index] === question.answer).length;
    return `${category} ${correct}/${entries.length}`;
  }).join(" · ");
}

function shareText() {
  return `${playerName ? `${playerName} — ` : ""}Mon résultat au quiz ludique TEST-QI : ${resultData.score}/${resultData.total} (${resultData.percent} %), niveau ${resultData.difficulty}. ${categorySummary()}. Ce quiz ne mesure pas le QI.`;
}

async function shareResult() {
  if (!resultData) return;
  const text = shareText();
  if (navigator.share) {
    try {
      await navigator.share({ title: "Mon résultat au quiz de logique", text });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    saveStatus.textContent = "Résultat copié. Vous pouvez le coller dans votre message.";
  } catch {
    saveStatus.textContent = text;
  }
}

function saveResult() {
  if (!resultData) return;
  const text = `${shareText()}\nTemps restant : ${formatTime(resultData.secondsLeft)}\nDate : ${new Date(resultData.date).toLocaleString("fr-FR")}\n\nCe résultat est un score de jeu, pas un score de QI.\n`;
  if (!resultSaved) {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      history.unshift({ ...resultData, domains: categorySummary() });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
      resultSaved = true;
    } catch {
      // Download remains available if browser storage is disabled.
    }
  }
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resultat-quiz-logique-${new Date(resultData.date).toISOString().slice(0, 10)}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  saveStatus.textContent = resultSaved
    ? "Résultat téléchargé et sauvegardé dans l’historique de ce navigateur."
    : "Résultat téléchargé. La sauvegarde locale n’est pas disponible dans ce navigateur.";
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = `Son : ${soundEnabled ? "ON" : "OFF"}`;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  if (soundEnabled) playTone(520, 0.08);
});
$("#start").addEventListener("click", startQuiz);
$("#share-result").addEventListener("click", shareResult);
$("#save-result").addEventListener("click", saveResult);
$("#toggle-review").addEventListener("click", (event) => {
  review.hidden = !review.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!review.hidden));
  event.currentTarget.textContent = review.hidden ? "Voir la correction" : "Masquer la correction";
  if (!review.hidden) review.scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#restart").addEventListener("click", () => {
  clearInterval(timerId);
  result.hidden = true;
  intro.hidden = false;
  timer.textContent = formatTime(TEST_DURATION_SECONDS);
  timer.classList.remove("warning");
});

updateTimer();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
