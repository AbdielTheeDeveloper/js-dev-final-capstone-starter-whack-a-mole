// ==============================
// SELECTORS
// ==============================
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.getElementById('start');
const scoreDisplay = document.getElementById('score'); 
const timerDisplay = document.getElementById('timer');

// ==============================
// GAME VARIABLES
// ==============================
let time = 30; // game duration in seconds
let timer;
let lastHole = null;
let points = 0;
let difficulty = "hard";

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
  return 1000; // default
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
  if (scoreDisplay) scoreDisplay.textContent = points;
  audioHit.play();
}

function clearScore() {
  points = 0;
  if (scoreDisplay) scoreDisplay.textContent = points;
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
    if (timerDisplay) timerDisplay.textContent = time;
  } else {
    clearInterval(timer);
    stopGame();
  }
}

function startTimer() {
  if (timerDisplay) timerDisplay.textContent = time; 
  timer = setInterval(updateTimer, 1000);
}

// ==============================
// AUDIO CONTROL
// ==============================
function playAudio(audioObject) {
  audioObject.play();
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
  return "game stopped";
}

function startGame() {
  clearScore();
  stopGame();
  setDuration(30); // Game duration in seconds
  startTimer();
  showUp();
  loopAudio(song);
  return "game started";
}

// ==============================
// INITIALIZE
// ==============================
moles.forEach(mole => mole.addEventListener('click', whack));
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
