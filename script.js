//Notes:
//should include some randomness in pattern..
//could add button/scroller to adjust sound..
//consider tweaking code for syntehsizing sound.
//https://www.the-art-of-web.com/javascript/creating-sounds/
//tweak freqMap to adjust pitches..

// global constants 
//how long to hold each clue's light/sound

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global variables initialized:
var pattern = [2,2,4,3,2,2,4,6,5,7,6]; //temp, 11 sequences.
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

var clueHoldTime = 1500; //1000MS = 1second -> chnage
var numOfMistakes = 0;


//generates randomPattern
function generatePattern(){
  let length = pattern.length;
  pattern = [];
  for(let i = 0; i < length; ++i){
    pattern.push(Math.floor(Math.random() * Math.floor(6)) + 1); //(0, 1, ... 6) + 1(button location)
  }
}
function startGame(){
  //initialize game variables
  //timer(); //start timer
  progress = 0;
  gamePlaying = true;
  numOfMistakes = 0;
  generatePattern();  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
function stopGame(){
  //initialize game variables
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//-------------------------//
// Sound Synthesis Functions
const freqMap = {
  1: 250,
  2: 310,
  3: 370,
  4: 450,
  5: 510,
  6: 570,
  7: 630
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
  tonePlaying = true;
  setTimeout(function(){
    stopTone();
  },len);
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
    tonePlaying = true;
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025);
    tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
//var context = new webkitAudioContext(); //for safari
var context = new AudioContext(); 
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0,context.currentTime);
o.connect(g);
o.start(0);

//Functions for lighting or clearing button.:
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit");
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit");
}

//plays single clue
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
//plays clue sequence
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  clueHoldTime = 1500 - (1000*(progress/8)); //else standard.
  if(clueHoldTime < 500)
  { clueHoldTime = 500;} //our lowestclueHoldTime is 500.
  for(let i=0;i<=progress;++i){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
}

//------------------------//
//Checking user_response.:
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!!")
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //game logic here..
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //Calls timer to reset interval each time.. for each guess..
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Player makes a mistake, +1
    numOfMistakes++; 
    if(numOfMistakes == 3){ 
      //Player loses after 3 mistakes..
      //GAME OVER: LOSE!
      loseGame();
    }
  }
}

//TIMER LOGIC:
//...

