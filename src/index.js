const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#start');
const score = document.querySelector('#score'); 
const timerDisplay = document.querySelector('#timer');


let time = 0;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "hard";


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("A random integer between 0 and 10");
console.log(randomInteger(0, 10));
console.log("Another random integer between 0 and 10");
console.log(randomInteger(0, 10));
console.log("A random number between 600 and 1200");
console.log(randomInteger(600, 1200));

function setDelay(difficulty) {
  if (difficulty === "easy") {
    return 1500;
  } else if (difficulty === "normal") {
    return 1000;
  } else if (difficulty === "hard") {
    return randomInteger(600, 1200);
  } else {
    // default fallback
    return 1000;
  }
}

function chooseHole(holes) {
  const index = randomInteger(0, 8);
  const hole = holes[index];
  if (hole === lastHole) {
    return chooseHole(holes);
  }
  lastHole = hole;
  return hole;
}

function gameOver() {
  if (time > 0) {
    const timeoutId = showUp();
    return timeoutId;
  } else {
    const gameStopped = stopGame();
    return gameStopped;
  }
}

function showUp() {
  let delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

function showAndHide(hole, delay) {
  toggleVisibility(hole);
  const timeoutID = setTimeout(() => {
    toggleVisibility(hole); 
    gameOver(); 
  }, delay);
  return timeoutID;
}

function toggleVisibility(hole) {
  hole.classList.toggle('show'); 
  return hole; 
}

function updateScore() {
  points += 1;
  const score = document.getElementById("score");
  if (score) {
    score.textContent = points;
  }
  return points;
}


function clearScore() {
  points = 0;
  const score = document.getElementById("score");
  if (score) {
    score.textContent = points;
  }
  return points;
}


let time = 30; 
let timer; 
const timerDisplay = document.getElementById('timer'); 

function updateTimer() {
  if (time > 0) {
    time -= 1;
    if (timerDisplay) {
      timerDisplay.textContent = time;
    }
  } else {
    clearInterval(timer);
  }
  return time;
}

function startTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = time; 
  }
  timer = setInterval(updateTimer, 1000);
  return timer;
}
startTimer();


const moles = document.querySelectorAll('.mole');
let points = 0;
const score = document.getElementById('score');

function updateScore() {
  points++;
  if (score) {
    score.textContent = points;
  }
  console.log(points);
  return points;
}

function whack(event) {
  console.log("whack!");
  if (!event.target.classList.contains('hit')) {
    event.target.classList.add('hit');
    updateScore();
    setTimeout(() => event.target.classList.remove('hit'), 500);
  }
}
function setEventListeners() {
  for (let i = 0; i < moles.length; i++) {
    moles[i].addEventListener('click', whack);
  }
  return moles;
}
setEventListeners();


/**
*
* This function sets the duration of the game. The time limit, in seconds,
* that a player has to click on the sprites.
*
*/
function setDuration(duration) {
  time = duration;
  return time;
}

/**
*
* This function is called when the game is stopped. It clears the
* timer using clearInterval. Returns "game stopped".
*
*/
function stopGame(){
  // stopAudio(song);  //optional
  clearInterval(timer);
  return "game stopped";
}

function startGame() {
  clearScore();       
  stopGame(); 
  setDuration(10);    
  setEventListeners(); 
  startTimer();        
  showUp();         
  return "game started";
}


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
