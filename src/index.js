// ==============================
// SELECTORS
// ==============================
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.getElementById('start');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const modal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const playAgainButton = document.getElementById('playAgain');
const muteToggle = document.getElementById('mute');
const body = document.body;

// ==============================
// GAME VARIABLES
// ==============================
let time = 30;
let timer;
let lastHole = null;
let points = 0;
let difficulty = "hard";
let muted = false;

// Audio
const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");

// ==============================
// UTILITY FUNCTIONS
// ==============================
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDelay(difficulty) {
  if (difficulty === "easy") return 1500;
  if (difficulty === "normal") return 1000;
  if (difficulty === "hard") return randomInteger(600, 1200);
  return 1000;
}

function chooseHole(holes) {
  const index = randomInteger(0, holes.length - 1);
  const hole = holes[index];
  if (hole === lastHole) return chooseHole(holes);
  lastHole = hole;
  return hole;
}

// ==============================
// MOLE VISIBILITY
// ==============================
function toggleVisibility(hole) {
  hole.classList.toggle('show'); 
}

function showAndHide(hole, delay) {
  toggleVisibility(hole);
  return setTimeout(() => {
    toggleVisibility(hole);
    if (time > 0) showUp();
  }, delay);
}

function showUp() {
  const delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

// ==============================
// SCORE
// ==============================
function updateScore() {
  points++;
  scoreDisplay.textContent = points;
  if (!muted) audioHit.play();
}

function clearScore() {
  points = 0;
  scoreDisplay.textContent = points;
}

// ==============================
// WHACK FUNCTION
// ==============================
function whack(event) {
  if (!event.target.classList.contains('hit')) {
    event.target.classList.add('hit');
    updateScore();
    setTimeout(() => event.target.classList.remove('hit'), 500);
  }
}

// ==============================
// TIMER
// ==============================
function updateTimer() {
  if (time > 0) {
    time--;
    timerDisplay.textContent = time;
  } else {
    clearInterval(timer);
    stopGame();
    gameOver();
  }
}

function startTimer() {
  timerDisplay.textContent = time; 
  timer = setInterval(updateTimer, 1000);
}

// ==============================
// AUDIO CONTROL
// ==============================
function playAudio(audioObject) {
  if (!muted) audioObject.play();
}

function loopAudio(audioObject) {
  audioObject.loop = true;
  playAudio(audioObject);
}

function stopAudio(audioObject) {
  audioObject.pause();
  audioObject.currentTime = 0;
}

// ==============================
// GAME CONTROL
// ==============================
function setDuration(duration) {
  time = duration;
}

function stopGame() {
  clearInterval(timer);
  stopAudio(song);
}

function gameOver() {
  finalScore.textContent = points;
  modal.style.display = "flex";
  body.classList.add('blurred'); // blur background
}

function closeModal() {
  modal.style.display = "none";
  body.classList.remove('blurred');
}

function startGame() {
  closeModal();
  clearScore();
  stopGame();
  setDuration(30);
  startTimer();
  showUp();
  loopAudio(song);
  setEventListeners();
}

// ==============================
// EVENT LISTENERS
// ==============================
function setEventListeners() {
  moles.forEach(mole => {
    mole.removeEventListener('click', whack);
    mole.addEventListener('click', whack);

    // Accessibility & keyboard control
    mole.setAttribute('tabindex', '0');
    mole.setAttribute('role', 'button');
    mole.setAttribute('aria-label', 'Whack the dog');
    mole.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        whack({ target: mole });
      }
    });
  });

  playAgainButton.addEventListener('click', startGame);

  // Mute toggle with icon and class
  muteToggle.addEventListener('click', () => {
    muted = !muted;
    muteToggle.classList.toggle('muted', muted);
    muteToggle.textContent = muted ? 'Unmute' : 'Mute';
  });
}

// ==============================
// INITIALIZE
// ==============================
startButton.addEventListener("click", startGame);



// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;
