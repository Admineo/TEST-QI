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

let current = 0;
let score = 0;
let timeLeft = TOTAL_SECONDS;
let timerId = null;
let locked = false;

function formatTime(value) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
  hint.textContent = "Sélectionnez une réponse.";
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
  if (isCorrect) score += 1;

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

function endTest(timeExpired) {
  clearInterval(timerId);
  quiz.hidden = true;
  result.hidden = false;
  scoreValue.textContent = String(score);

  let message = "";
  if (score >= 24) {
    message = "Excellent ! Votre logique est très solide.";
  } else if (score >= 18) {
    message = "Très bien ! Vous avez de bonnes capacités de raisonnement.";
  } else if (score >= 12) {
    message = "Bon effort ! Vous avez un bon sens de la logique.";
  } else if (score >= 7) {
    message = "Pas mal ! Continuez à entraîner votre réflexion.";
  } else {
    message = "Le score est modeste, mais chaque essai permet de progresser.";
  }

  resultMessage.textContent = message;
  if (timeExpired) {
    timeMessage.textContent = "Temps écoulé : le quiz s’est arrêté automatiquement.";
  } else {
    timeMessage.textContent = `Temps restant : ${formatTime(timeLeft)}.`;
  }
}

function startQuiz() {
  current = 0;
  score = 0;
  timeLeft = TOTAL_SECONDS;
  locked = false;
  updateTimer();
  intro.hidden = true;
  result.hidden = true;
  quiz.hidden = false;
  startTimer();
  showQuestion();
}

function restartQuiz() {
  clearInterval(timerId);
  result.hidden = true;
  intro.hidden = false;
  timer.classList.remove("warning");
  timer.textContent = "30:00";
}

document.querySelector("#start").addEventListener("click", startQuiz);
document.querySelector("#restart").addEventListener("click", restartQuiz);

updateTimer();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
