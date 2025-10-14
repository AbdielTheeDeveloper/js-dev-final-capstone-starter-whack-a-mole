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

  // 🎵 Audio setup
  const audioHit = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/hit.mp3?raw=true");
  const song = new Audio("https://github.com/gabrielsanchez/erddiagram/blob/main/molesong.mp3?raw=true");
  song.loop = true;

  console.log("✅ Game variables initialized");

  /* ==============================
    HELPER FUNCTIONS
    ============================== */

  function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) return randomHole();
    lastHole = hole;
    return hole;
  }

  function randomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function chooseHole(holes) {
    const index = randomInteger(0, holes.length - 1);
    return holes[index];
  }

  function setDelay() {
    return Math.random() * 800 + 600; // stays up 600–1400ms
  }

  /* ==============================
    GAME CORE
    ============================== */

  function showMole() {
    if (!running) return;
    const hole = randomHole();
    const showTime = setDelay();

    hole.classList.add("show");
    setTimeout(() => hole.classList.remove("show"), showTime);
  }

  // Keep spawning moles
  function spawnMoles() {
    if (!running) return;
    showMole();
    const nextMoleTime = Math.random() * 600 + 400; // next spawn 400–1000ms
    setTimeout(spawnMoles, nextMoleTime);
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

  // ✅ FIXED: ensure song plays after user click (browser autoplay policies)
  function startGame() {
    console.log("🎮 Starting game...");
    points = 0;
    time = 30;
    running = true;
    scoreDisplay.textContent = points;
    timerDisplay.textContent = time;
    modal.style.display = "none";
    clearInterval(timer);
    startTimer();
    spawnMoles();

    if (!muted) {
      song.currentTime = 0;
      // Explicitly play after user-initiated event
      song.play().then(() => {
        console.log("🎵 Background music playing");
      }).catch(e => {
        console.warn("⚠️ Audio play blocked by browser:", e);
      });
    }
  }

  function endGame() {
    console.log("🏁 Game over! Final score:", points);
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
      if (!muted) {
        audioHit.currentTime = 0;
        audioHit.play().catch(e => console.warn("Audio play failed:", e));
      }
      setTimeout(() => e.target.classList.remove("hit"), 300);
    }
  }

  function toggleMute() {
    muted = !muted;
    console.log(`🔊 Sound ${muted ? "muted" : "unmuted"}`);

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

  /* ==============================
    TESTABLE UTILITY FUNCTIONS
    ============================== */

  function toggleVisibility(element) {
    if (!element) return;
    const current = element.style.display;
    element.style.display = (current === "none" || current === "") ? "block" : "none";
  }

  function showUp(hole, duration = 800) {
    if (!hole) return;
    hole.classList.add("show");
    setTimeout(() => hole.classList.remove("show"), duration);
  }

  function setDuration(seconds) {
    time = seconds;
    timerDisplay.textContent = time;
  }

  function gameOver() {
    endGame();
  }

  /* ==============================
    EVENT LISTENERS
    ============================== */

  startButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);
  muteButton.addEventListener("click", toggleMute);
  moles.forEach(mole => mole.addEventListener("click", whack));

  console.log("✅ Event listeners attached");
  console.log("✅ Game ready! Click 'Start' to play.");

  /* ==============================
    WINDOW EXPORTS (for tests)
    ============================== */
  window.randomInteger = randomInteger;
  window.chooseHole = chooseHole;
  window.setDelay = setDelay;
  window.startGame = startGame;
  window.gameOver = gameOver;
  window.showUp = showUp;
  window.holes = holes;
  window.moles = moles;
  window.showAndHide = showUp;
  window.points = points;
  window.updateScore = () => scoreDisplay.textContent = points;
  window.clearScore = () => { points = 0; scoreDisplay.textContent = points; };
  window.whack = whack;
  window.time = time;
  window.setDuration = setDuration;
  window.toggleVisibility = toggleVisibility;
  window.setEventListeners = () => {
    startButton.addEventListener("click", startGame);
    playAgainButton.addEventListener("click", startGame);
    muteButton.addEventListener("click", toggleMute);
    moles.forEach(mole => mole.addEventListener("click", whack));
  };
});
