console.log("✅ JavaScript loaded!");

window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded, initializing game...");

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

  // Audio
  const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
  const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");
  song.loop = true;

  console.log("✅ Game variables initialized");

  // Get random hole
  function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) return randomHole();
    lastHole = hole;
    return hole;
  }

  // Show mole
  function showMole() {
    if (!running) return;
    const hole = randomHole();
    hole.classList.add("show");
    setTimeout(() => {
      hole.classList.remove("show");
      if (running) showMole();
    }, Math.random() * 800 + 400);
  }

  // Update timer
  function updateTimer() {
    if (time > 0) {
      time--;
      timerDisplay.textContent = time;
    } else {
      endGame();
    }
  }

  // Start timer
  function startTimer() {
    timerDisplay.textContent = time;
    timer = setInterval(updateTimer, 1000);
  }

  // Start game
  function startGame() {
    console.log("🎮 Starting game...");
    points = 0;
    time = 30;
    running = true;
    scoreDisplay.textContent = points;
    timerDisplay.textContent = time;
    modal.style.display = "none";
    startTimer();
    showMole();
    if (!muted) {
      song.currentTime = 0;
      song.play().catch(e => console.warn("Audio play failed:", e));
    }
  }

  // End game
  function endGame() {
    console.log("🏁 Game over! Final score:", points);
    running = false;
    clearInterval(timer);
    song.pause();
    modal.style.display = "flex";
    finalScore.textContent = points;
  }

  // Whack mole
  function whack(e) {
    if (!running) return;
    if (!e.target.classList.contains("hit")) {
      e.target.classList.add("hit");
      points++;
      scoreDisplay.textContent = points;
      if (!muted) {
        audioHit.currentTime = 0;
        audioHit.play().catch(e => console.warn("Audio play failed:", e));
      }
      setTimeout(() => e.target.classList.remove("hit"), 300);
    }
  }

  // Toggle mute
  function toggleMute() {
    muted = !muted;
    console.log(`🔊 Sound ${muted ? 'muted' : 'unmuted'}`);
    
    // Toggle the CSS class for icon change
    if (muted) {
      muteButton.classList.add("muted");
      song.pause();
    } else {
      muteButton.classList.remove("muted");
      if (running) {
        song.play().catch(e => console.warn("Audio play failed:", e));
      }
    }
  }

  // Event listeners
  startButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);
  muteButton.addEventListener("click", toggleMute);
  moles.forEach(mole => mole.addEventListener("click", whack));

  console.log("✅ Event listeners attached");
  console.log("✅ Game ready! Click 'Start' to play.");
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
