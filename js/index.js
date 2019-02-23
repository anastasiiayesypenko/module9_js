'use strict'

//query selectors
const startButton = document.querySelector('.js-start');
const lapButton = document.querySelector('.js-take-lap');
const resetButton = document.querySelector('.js-reset');
const timeLine = document.querySelector('.js-time');
const listOfLaps = document.querySelector('.js-laps');

// set glabal variables for functions
let deltaTime = 0;
let TimerTime;
let BegingTime;
let isActive = false;
let minutes;
let seconds;
let milliseconds;
let intervalID;
let continueInterval;
let lap;
let pause;
let continueBeginTime;
let deltaContinueTime;

// add listeners for clicks
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', onReset);
lapButton.addEventListener('click', onLap);

resetButton.disabled = true;

// set interval on Start click
function startTimer() {
  BegingTime = Date.now();
  if (!isActive) {
    isActive = true;
    resetButton.disabled = false;
    changeButtonText('Pause');
    startButton.addEventListener('click', onPause);
    startButton.removeEventListener('click', startTimer);
    intervalID = setInterval(setTime, 100);
  };
};
// Interval function 
function setTime() {
  TimerTime = Date.now();
  deltaTime = TimerTime - BegingTime;
  findMinSecMillisec(deltaTime);
  writeTime();
};

function findMinSecMillisec(deltaTime) {
  seconds = Number.parseInt(deltaTime / 1000 % 60);
  minutes = Number.parseInt(deltaTime / 1000 / 60 % 60);
  milliseconds = Number.parseInt(deltaTime % 1000 / 100);
  if (minutes < 10) {
      minutes = `0${minutes}`;
  };
  if (seconds < 10) {
      seconds = `0${seconds}`;
  };
}
// represent data from setTime() function
function writeTime() {
  timeLine.textContent = `${minutes}:${seconds}.${milliseconds}`;
}



// Pause
function onPause() {
  isActive = false;
  clearInterval(intervalID);
  clearInterval(continueInterval);
  pause = minutes * 60000 + seconds * 1000 + milliseconds * 100;
  changeButtonText('Continue');
  startButton.removeEventListener('click', onPause);
  startButton.addEventListener('click', onContinue);
};

// Continue
function onContinue() {
  continueBeginTime = Date.now();
  if (!isActive) {
    isActive = true;
    changeButtonText('Pause');
    startButton.removeEventListener('click', onContinue);
    continueInterval = setInterval(getContinueTime, 100);
    startButton.addEventListener('click', onPause);
  };
}
function getContinueTime() {
  let continueTime = Date.now();
  deltaContinueTime = continueTime - continueBeginTime + pause;
  findMinSecMillisec(deltaContinueTime);
  writeTime();
}

// Reset
function onReset() {
  isActive = false;
  resetButton.disabled = true;
  changeButtonText('Start')
  startButton.removeEventListener('click', onPause);
  startButton.removeEventListener('click', onContinue);
  startButton.addEventListener('click', startTimer);
  clearInterval(intervalID);
  clearInterval(continueInterval);
  timeLine.textContent = '00:00.0';
}

// Create laps
function onLap() {
  lap = document.createElement('li');
  lap.textContent = timeLine.textContent; 
  listOfLaps.appendChild(lap);
}

// Change Button text
function changeButtonText(buttonName) {
  startButton.textContent = buttonName;
}

