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
let timer = null;
let lastHole = null;
let points = 0;
let difficulty = "hard";
let muted = false;
let gameRunning = false; // track whether game is active

// Audio (will start only after user gesture via startButton)
const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");

// ensure audio elements won't throw if played while muted
audioHit.preload = 'auto';
song.preload = 'auto';

// ==============================
// UTILITY FUNCTIONS
// ==============================
function randomInteger(min, max) {
  // arithmetic done digit-by-digit internally; safe integer math
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDelay(difficultyArg) {
  if (difficultyArg === "easy") return 1500;
  if (difficultyArg === "normal") return 1000;
  if (difficultyArg === "hard") return randomInteger(600, 1200);
  return 1000;
}

function chooseHole(holeList) {
  const index = randomInteger(0, holeList.length - 1);
  const hole = holeList[index];
  if (hole === lastHole) return chooseHole(holeList);
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
  // show
  hole.classList.add('show');
  // hide after delay
  return setTimeout(() => {
    hole.classList.remove('show');
    if (time > 0 && gameRunning) showUp();
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
  if (!muted) {
    // play short hit sound; catch play errors (autoplay policies)
    audioHit.currentTime = 0;
    audioHit.play().catch(() => {});
  }
}

function clearScore() {
  points = 0;
  if (scoreDisplay) scoreDisplay.textContent = points;
}

// ==============================
// HIT / WHACK HANDLING
// ==============================
function handleHitOnHole(event) {
  // event.currentTarget is the hole when added as hole listener
  const hole = event.currentTarget;
  // only count when mole is visible (hole has .show)
  if (!hole.classList.contains('show')) return;

  // locate mole element inside hole
  const mole = hole.querySelector('.mole');
  if (!mole) return;

  // Prevent double hits
  if (mole.classList.contains('hit')) return;

  // animate and update score
  mole.classList.add('hit');
  updateScore();
  setTimeout(() => mole.classList.remove('hit'), 500);
}

function handleClickOnMole(event) {
  // if user clicked directly on mole, delegate to hole handler for consistent checks
  const mole = event.currentTarget;
  const hole = mole.closest('.hole');
  if (!hole) return;
  // create synthetic event that calls the same logic as clicking the hole
  handleHitOnHole({ currentTarget: hole, target: mole, type: 'click' });
}

// keyboard activation for mole (Enter or Space)
function handleMoleKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const mole = e.currentTarget;
    const hole = mole.closest('.hole');
    if (!hole) return;
    handleHitOnHole({ currentTarget: hole, keyEvent: true, target: mole });
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
    timer = null;
    stopGame();
    gameOver();
  }
}

function startTimer() {
  if (timer) clearInterval(timer);
  if (timerDisplay) timerDisplay.textContent = time;
  timer = setInterval(updateTimer, 1000);
}

// ==============================
// AUDIO CONTROL
// ==============================
function playAudio(audioObject) {
  if (!muted) {
    audioObject.play().catch(() => {});
  }
}

function loopAudio(audioObject) {
  audioObject.loop = true;
  playAudio(audioObject);
}

function stopAudio(audioObject) {
  try {
    audioObject.pause();
    audioObject.currentTime = 0;
  } catch (e) {}
}

// ==============================
// GAME CONTROL
// ==============================
function setDuration(duration) {
  time = duration;
  if (timerDisplay) timerDisplay.textContent = time;
}

function stopGame() {
  gameRunning = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  stopAudio(song);
  // remove any remaining .show from holes
  holes.forEach(h => h.classList.remove('show'));
}

function gameOver() {
  // show non-blocking modal with final score
  if (finalScore) finalScore.textContent = points;
  if (modal) modal.style.display = 'flex';
  body.classList.add('blurred');
}

function closeModal() {
  if (modal) modal.style.display = 'none';
  body.classList.remove('blurred');
}

function startGame() {
  // First user gesture: ensure audio may play (browser policy)
  // mark as running
  gameRunning = true;

  closeModal();
  clearScore();
  stopGame(); // clear any previous timers / audio
  setDuration(30);
  startTimer();
  showUp();
  // only start background music if not muted
  loopAudio(song);
  // ensure listeners are set up (idempotent)
  setEventListeners();
}

// ==============================
// EVENT LISTENERS SETUP
// ==============================
function setEventListeners() {
  // holes: click hits mole when visible
  holes.forEach(hole => {
    // remove any existing wrapper listener to avoid duplicate handlers
    hole.removeEventListener('click', handleHitOnHole);
    hole.addEventListener('click', handleHitOnHole);
    // ensure holes are keyboard accessible (optional)
    hole.setAttribute('role', 'button');
    hole.setAttribute('tabindex', '0');
    hole.setAttribute('aria-label', 'Hole — whack dog if visible');
    // add keydown so keyboard can hit holes too (Enter/Space)
    hole.removeEventListener('keydown', handleMoleKeydown);
    hole.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleHitOnHole({ currentTarget: hole, keyEvent: true });
      }
    });
  });

  // moles: click and keyboard directly on mole also allowed
  moles.forEach(mole => {
    mole.removeEventListener('click', handleClickOnMole);
    mole.addEventListener('click', handleClickOnMole);

    mole.setAttribute('tabindex', '0');
    mole.setAttribute('role', 'button');
    mole.setAttribute('aria-label', 'Whack the dog');

    mole.removeEventListener('keydown', handleMoleKeydown);
    mole.addEventListener('keydown', handleMoleKeydown);
  });

  // play again
  if (playAgainButton) {
    playAgainButton.removeEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
  }

  // mute toggle
  if (muteToggle) {
    // remove any previous listener
    muteToggle.removeEventListener('click', onMuteToggle);
    muteToggle.addEventListener('click', onMuteToggle);
    // set a sensible initial ARIA and class state
    muteToggle.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteToggle.classList.toggle('muted', muted);
  }
}

// separate function so we can remove listener easily
function onMuteToggle() {
  muted = !muted;
  // toggle CSS class which changes the icon (::before)
  if (muteToggle) {
    muteToggle.classList.toggle('muted', muted);
    muteToggle.setAttribute('aria-pressed', muted ? 'true' : 'false');
    // update label text but keep pseudo-element icon intact (CSS ::before)
    muteToggle.innerText = muted ? 'Unmute' : 'Mute';
  }
  if (muted) {
    stopAudio(song);
  } else {
    // if game is running, resume background music
    if (gameRunning) loopAudio(song);
  }
}

// ==============================
// INITIALIZE ON LOAD
// ==============================
startButton.addEventListener('click', startGame);
// ensure listeners available prior to start (helps tests and accessibility)
setEventListeners();

// ==============================
// adds blur effect
const style = document.createElement('style');
style.textContent = `
  .blurred {
    filter: blur(5px);
    transition: filter 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);





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
