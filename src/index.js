document.addEventListener("DOMContentLoaded", () => {
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
  const muteButton = document.getElementById('mute');

  // ==============================
  // VARIABLES
  // ==============================
  let time = 30;
  let timer;
  let lastHole = null;
  let points = 0;
  let difficulty = "hard";
  let muted = false;
  let gameRunning = false;

  // Audio setup
  const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
  const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");
  song.loop = true;

  // ==============================
  // UTILITIES
  // ==============================
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setDelay() {
    if (difficulty === "easy") return 1500;
    if (difficulty === "normal") return 1000;
    if (difficulty === "hard") return randomInteger(600, 1200);
  }

  function chooseHole(holes) {
    const index = randomInteger(0, holes.length - 1);
    const hole = holes[index];
    if (hole === lastHole) return chooseHole(holes);
    lastHole = hole;
    return hole;
  }

  // ==============================
  // MOLE BEHAVIOR
  // ==============================
  function toggleVisibility(hole) {
    hole.classList.toggle('show');
  }

  function showAndHide(hole, delay) {
    toggleVisibility(hole);
    setTimeout(() => {
      toggleVisibility(hole);
      if (time > 0 && gameRunning) showUp();
    }, delay);
  }

  function showUp() {
    const delay = setDelay();
    const hole = chooseHole(holes);
    showAndHide(hole, delay);
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
    if (!gameRunning) return;
    if (!event.target.classList.contains('hit')) {
      event.target.classList.add('hit');
      updateScore();
      setTimeout(() => event.target.classList.remove('hit'), 300);
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
      showGameOver();
    }
  }

  function startTimer() {
    timerDisplay.textContent = time;
    timer = setInterval(updateTimer, 1000);
  }

  // ==============================
  // AUDIO
  // ==============================
  function playSong() {
    if (!muted) song.play();
  }

  function stopSong() {
    song.pause();
    song.currentTime = 0;
  }

  // ==============================
  // GAME CONTROL
  // ==============================
  function startGame() {
    modal.style.display = "none";
    clearScore();
    time = 30;
    timerDisplay.textContent = time;
    gameRunning = true;
    startTimer();
    showUp();
    playSong();
  }

  function stopGame() {
    gameRunning = false;
    clearInterval(timer);
    stopSong();
  }

  function showGameOver() {
    gameRunning = false;
    finalScore.textContent = points;
    modal.style.display = "flex";
  }

  // ==============================
  // EVENT LISTENERS
  // ==============================
  moles.forEach(mole => {
    mole.addEventListener('click', whack);
    mole.setAttribute('tabindex', '0');
    mole.setAttribute('role', 'button');
    mole.setAttribute('aria-label', 'Whack the dog');
    mole.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') whack({ target: mole });
    });
  });

  startButton.addEventListener('click', startGame);
  playAgainButton.addEventListener('click', startGame);
  muteButton.addEventListener('click', () => {
    muted = !muted;
    muteButton.textContent = muted ? 'Unmute' : 'Mute';
    if (muted) stopSong();
  });
});


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
