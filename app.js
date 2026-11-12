const TOTAL_QUESTIONS = 30;
const TOTAL_SECONDS = 30 * 60;

const questions = [
  { text: "Quelle est la suite : 2, 4, 8, 16, …", options: ["18", "24", "32", "36"], answer: 2 },
  { text: "Quel élément ne va pas avec les autres ?", options: ["Carré", "Triangle", "Cercle", "Cube"], answer: 3 },
  { text: "Si tous les A sont des B, et tous les B sont des C, alors…", options: ["Tous les C sont des A", "Tous les A sont des C", "Aucun A n’est un C", "Aucune réponse"], answer: 1 },
  { text: "Quelle est la suite : 1, 1, 2, 3, 5, 8, …", options: ["11", "12", "13", "15"], answer: 2 },
  { text: "Un livre et un stylo coûtent 11 €. Le livre coûte 10 € de plus que le stylo. Combien coûte le stylo ?", options: ["0,50 €", "1 €", "1,50 €", "2 €"], answer: 0 },
  { text: "Quelle lettre vient ensuite : A, C, F, J, O, …", options: ["S", "T", "U", "V"], answer: 2 },
  { text: "Léa est plus grande que Sam. Sam est plus grand que Noé. Qui est le plus petit ?", options: ["Léa", "Sam", "Noé", "Impossible à savoir"], answer: 2 },
  { text: "Quelle est la suite : 3, 6, 11, 18, 27, …", options: ["36", "38", "40", "42"], answer: 1 },
  { text: "Si hier était dimanche, quel jour sera après-demain ?", options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"], answer: 1 },
  { text: "Une horloge avance de 5 minutes par heure. De combien avancera-t-elle en 6 heures ?", options: ["20 min", "25 min", "30 min", "35 min"], answer: 2 },
  { text: "Un mot a 4 lettres, la 2e est la lettre centrale, la 4e est la dernière lettre du mot « train ». Quel est le mot ?", options: ["Tire", "Rire", "Vrai", "Miro"], answer: 1 },
  { text: "Quel nombre manque : 9, 16, 25, 36, …", options: ["42", "45", "49", "56"], answer: 2 },
  { text: "Si 5 pommes coûtent 15 €, combien coûte 1 pomme ?", options: ["2 €", "3 €", "4 €", "5 €"], answer: 1 },
  { text: "Deux frères ont 10 ans de différence. L’un a 12 ans. Quel âge a l’autre ?", options: ["2 ans", "10 ans", "12 ans", "22 ans"], answer: 3 },
  { text: "Un train part à 8 h 15 et arrive à 9 h 45. Quelle est sa durée ?", options: ["1 h 15", "1 h 30", "1 h 45", "2 h"], answer: 1 },
  { text: "Quelle est la bonne logique : 3, 6, 12, 24, …", options: ["28", "30", "36", "48"], answer: 3 },
  { text: "Quel mot est différent : rouge, bleu, jaune, triangle ?", options: ["Rouge", "Bleu", "Jaune", "Triangle"], answer: 3 },
  { text: "Si la moitié de 20 est 10, quel est le quart de 20 ?", options: ["3", "4", "5", "6"], answer: 2 },
  { text: "Complétez : 4, 9, 16, 25, …", options: ["30", "36", "49", "64"], answer: 1 },
  { text: "Combien de côtés a un hexagone ?", options: ["5", "6", "7", "8"], answer: 1 },
  { text: "Le jour qui suit vendredi est…", options: ["Jeudi", "Samedi", "Dimanche", "Lundi"], answer: 1 },
  { text: "Quel est le prochain nombre : 5, 10, 20, 40, …", options: ["60", "70", "80", "90"], answer: 2 },
  { text: "Un carré a 4 côtés. Combien de côtés a 3 carrés ?", options: ["8", "10", "12", "16"], answer: 2 },
  { text: "Quelle est la valeur manquante : 7 + ? = 13", options: ["4", "5", "6", "7"], answer: 1 },
  { text: "Si A = 1, B = 2, C = 3, alors B + C = ?", options: ["3", "4", "5", "6"], answer: 2 },
  { text: "Lequel est le plus lourd ?", options: ["1 kg de plumes", "1 kg de fer", "1 kg de coton", "Même poids"], answer: 3 },
  { text: "Dans la série 2, 5, 10, 17, 26, … quel est le prochain ?", options: ["36", "37", "38", "39"], answer: 1 },
  { text: "Si un rectangle est plus long que large, alors…", options: ["Sa largeur est plus grande", "Il a 5 côtés", "Il a 2 dimensions", "Il est rond"], answer: 2 },
  { text: "Quel nombre ne suit pas la logique ? 8, 16, 24, 32, 41", options: ["8", "16", "24", "41"], answer: 3 },
  { text: "Un seul des objets est un animal. Lequel ?", options: ["Chaise", "Pomme", "Chien", "Table"], answer: 2 }
];

const intro = document.querySelector("#intro");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const timer = document.querySelector("#timer");
const soundToggle = document.querySelector("#sound-toggle");
const count = document.querySelector("#question-count");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const title = document.querySelector("#question-title");
const answers = document.querySelector("#answers");
const hint = document.querySelector("#answer-hint");
const scoreValue = document.querySelector("#score-value");
const resultMessage = document.querySelector("#result-message");
const timeMessage = document.querySelector("#time-message");
const timeLeftResult = document.querySelector("#time-left-result");
const scorePercent = document.querySelector("#score-percent");
const resultBadge = document.querySelector("#result-badge");
const confetti = document.querySelector("#confetti");

let current = 0;
let score = 0;
let timeLeft = TOTAL_SECONDS;
let timerId = null;
let locked = false;
let soundEnabled = true;
let audioCtx = null;

function formatTime(value) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function ensureAudio() {
  if (!soundEnabled) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(frequency, duration, type = "sine", volume = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.value = volume;
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
}

function playSuccessTone() {
  ensureAudio();
  playTone(740, 0.12, "triangle", 0.06);
  setTimeout(() => playTone(920, 0.14, "triangle", 0.06), 80);
}

function playErrorTone() {
  ensureAudio();
  playTone(210, 0.15, "sawtooth", 0.04);
}

function updateTimer() {
  timer.textContent = formatTime(timeLeft);
  if (timeLeft <= 30) {
    timer.classList.add("warning");
  } else {
    timer.classList.remove("warning");
  }
}

function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endTest(true);
      return;
    }
    timeLeft -= 1;
    updateTimer();
  }, 1000);
}

function showQuestion() {
  const question = questions[current];
  const progressPct = (current / TOTAL_QUESTIONS) * 100;
  count.textContent = `Question ${current + 1} sur ${TOTAL_QUESTIONS}`;
  progressLabel.textContent = `${Math.round(progressPct)} %`;
  progressTrack.setAttribute("aria-valuenow", String(current));
  progressFill.style.width = `${progressPct}%`;
  title.textContent = question.text;
  hint.textContent = "Sélectionnez la meilleure réponse.";
  answers.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.innerHTML = `<span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.lastElementChild.textContent = option;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });

  title.focus({ preventScroll: true });
}

function chooseAnswer(index) {
  if (locked) return;
  locked = true;

  const isCorrect = index === questions[current].answer;
  if (isCorrect) {
    score += 1;
    playSuccessTone();
  } else {
    playErrorTone();
  }

  current += 1;
  if (current < TOTAL_QUESTIONS) {
    setTimeout(() => {
      locked = false;
      showQuestion();
    }, 180);
  } else {
    setTimeout(() => endTest(false), 180);
  }
}

function createConfettiBurst() {
  confetti.innerHTML = "";
  const colors = ["#8b5cf6", "#7dd3fc", "#fbbf24", "#34d399", "#f472b6", "#fca5a5"];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty("--r", `${(Math.random() - 0.5) * 700}deg`);
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    confetti.appendChild(piece);
  }
}

function getGradeLabel(percent) {
  if (percent >= 80) return "Excellent niveau";
  if (percent >= 65) return "Très bon niveau";
  if (percent >= 50) return "Bon niveau";
  if (percent >= 35) return "Niveau moyen";
  return "Niveau débutant";
}

function endTest(timeExpired) {
  clearInterval(timerId);
  quiz.hidden = true;
  result.hidden = false;

  const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
  scoreValue.textContent = String(score);
  scorePercent.textContent = `${percent}%`;
  timeLeftResult.textContent = formatTime(timeLeft);
  resultBadge.textContent = getGradeLabel(percent);

  if (percent >= 80) {
    resultBadge.style.background = "rgba(52, 211, 153, 0.12)";
    resultBadge.style.borderColor = "rgba(52, 211, 153, 0.45)";
    createConfettiBurst();
  } else if (percent >= 50) {
    resultBadge.style.background = "rgba(125, 211, 252, 0.09)";
    resultBadge.style.borderColor = "rgba(125, 211, 252, 0.35)";
  } else {
    resultBadge.style.background = "rgba(251, 191, 36, 0.1)";
    resultBadge.style.borderColor = "rgba(251, 191, 36, 0.4)";
  }

  let message = "";
  if (percent >= 80) {
    message = "Excellent ! Votre logique est très forte et votre niveau est impressionnant.";
  } else if (percent >= 65) {
    message = "Très bon résultat. Vous avez de bonnes capacités de raisonnement et une vraie réactivité.";
  } else if (percent >= 50) {
    message = "Bonne performance. Votre logique est solide, il reste encore de la marge pour aller plus loin.";
  } else if (percent >= 35) {
    message = "Résultat honorable. Continuez à pratiquer, vous progressez déjà dans la bonne direction.";
  } else {
    message = "Chaque essai permet d’améliorer son raisonnement. Ne vous découragez pas, il suffit de continuer.";
  }

  resultMessage.textContent = message;
  if (timeExpired) {
    timeMessage.textContent = "Temps écoulé : le quiz s’est arrêté automatiquement.";
  } else {
    timeMessage.textContent = `Temps restant : ${formatTime(timeLeft)}.`;
  }

  if (soundEnabled) {
    playTone(660, 0.15, "triangle", 0.05);
    setTimeout(() => playTone(880, 0.12, "triangle", 0.05), 100);
  }
}

function startQuiz() {
  ensureAudio();
  current = 0;
  score = 0;
  timeLeft = TOTAL_SECONDS;
  locked = false;
  updateTimer();
  intro.hidden = true;
  result.hidden = true;
  quiz.hidden = false;
  progressFill.style.width = "0%";
  startTimer();
  showQuestion();
}

function restartQuiz() {
  clearInterval(timerId);
  confetti.innerHTML = "";
  result.hidden = true;
  intro.hidden = false;
  timer.classList.remove("warning");
  timer.textContent = "30:00";
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = `Son : ${soundEnabled ? "ON" : "OFF"}`;
  if (soundEnabled) ensureAudio();
});

document.querySelector("#start").addEventListener("click", startQuiz);
document.querySelector("#restart").addEventListener("click", restartQuiz);

updateTimer();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
