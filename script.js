// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const clueDecreasedTime = 2;
const patternElements = 5;
//Global Variables
var pattern = [6, 6, 5, 5, 1, 1, 5, 4, 4, 7, 7 , 2, 2, 3];
var patternType = 0;
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var gameStrikes = 0;



function startGame(){
    //initialize game variables
    progress = 0;
    gameStrikes = 0;
    gamePlaying = true;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  patternType = getRandomIntForPattern(2);
  console.log("patternType is: " + patternType);
  if (patternType == 1){
    randomPattern();
    playClueSequence();
  }else
    playClueSequence();
}
  
function randomPattern(){
  pattern = []
  var j = 0;
  while (j < patternElements){
    pattern[j] = getRandomIntSoundPattern(1, 7)
    j++;
  }
  console.log(pattern);
}

function stopGame(){
    //initialize game variables
    gamePlaying = false;
  
  // swap the Start and Stop buttons
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 440,
  2: 294,
  3: 523 ,
  4: 349,
  5: 392,
  6: 262,
  7: 330,

}
  
function getRandomIntForPattern(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntSoundPattern(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    if (btn == pattern[guessCounter])
      document.getElementById("star"+btn).classList.remove("hidden");
  }
}
function stopTone(btn){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
  document.getElementById("star"+btn).classList.add("hidden");
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  console.log("pattern is: " + pattern);
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("pattern at: " + pattern[i]);
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    console.log("cludeHoldTime is at: " + clueHoldTime)
    clueHoldTime -= clueDecreasedTime;
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
  

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game over. Congrats, you won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  //if guess is correct
  if (pattern[guessCounter] == btn){
    console.log("user guessed is correct");
    //if turn is not over
    if (guessCounter == progress){
      //if this is the last turn, winGame function gets called
      if(progress == pattern.length-1){
        winGame();
      }
      //increment progress
      else{
         progress++; 
         playClueSequence();
      }
    }
    //increment guessCounter
    else{
      guessCounter++;
    }
  }
  //if guess is wrong, loseGame function gets called
  else{
    if (gameStrikes < 2){
      gameStrikes++;
      alert("Strike "+gameStrikes+"! Let's play the pattern again.")
      playClueSequence();
    }
    else
    loseGame();
  }
}