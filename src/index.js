window.addEventListener("DOMContentLoaded", () => {
  const holes = document.querySelectorAll(".hole");
  const moles = document.querySelectorAll(".mole");
  const startButton = document.getElementById("start");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const modal = document.getElementById("gameOverModal");
  const finalScore = document.getElementById("finalScore");
  const playAgainButton = document.getElementById("playAgain");
  const muteButton = document.getElementById("mute");

  let time = 30;
  let timer = null;
  let points = 0;
  let lastHole = null;
  let running = false;
  let muted = false;

  const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
  const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");
  song.loop = true;

  function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) return randomHole();
    lastHole = hole;
    return hole;
  }

  function showMole() {
    if (!running) return;
    const hole = randomHole();
    hole.classList.add("show");
    setTimeout(() => {
      hole.classList.remove("show");
      if (running) showMole();
    }, Math.random() * 800 + 400);
  }

  function updateTimer() {
    if (time > 0) {
      time--;
      timerDisplay.textContent = time;
    } else {
      endGame();
    }
  }

  function startTimer() {
    timerDisplay.textContent = time;
    timer = setInterval(updateTimer, 1000);
  }

  function startGame() {
    points = 0;
    time = 30;
    running = true;
    scoreDisplay.textContent = points;
    modal.style.display = "none";
    startTimer();
    showMole();
    if (!muted) song.play();
  }

  function endGame() {
    running = false;
    clearInterval(timer);
    song.pause();
    modal.style.display = "flex";
    finalScore.textContent = points;
  }

  function whack(e) {
    if (!running) return;
    if (!e.target.classList.contains("hit")) {
      e.target.classList.add("hit");
      points++;
      scoreDisplay.textContent = points;
      if (!muted) audioHit.play();
      setTimeout(() => e.target.classList.remove("hit"), 300);
    }
  }

  function toggleMute() {
    muted = !muted;
    muteButton.textContent = muted ? "Unmute" : "Mute";
    if (muted) {
      song.pause();
    } else if (running) {
      song.play();
    }
  }

  startButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);
  muteButton.addEventListener("click", toggleMute);
  moles.forEach(mole => mole.addEventListener("click", whack));
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
