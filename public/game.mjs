import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { generateStartPos, canvasCalcs} from './canvas-data.mjs'


const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

// Function I have found online that will generate a uuidv4 unique id
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Preloading game assets (images etc)
const loadImage = src => {
  const img = new Image();
  img.src = src;
  return img;
}

const bronzeCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png');
const silverCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png');
const goldCoinArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png');
const mainPlayerArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/main-player.png');
const otherPlayerArt = loadImage('https://cdn.freecodecamp.org/demo-projects/images/other-player.png');


// Below is the game settings
let playerSize = {
  width: 30,
  height: 30
};

let playerPosition = {
  x: 200,
  y: 200
};

let defaultStartScore = 0;
let initialCollectibleLocation = {
  x : Math.floor(Math.random*100),
  y : Math.floor(Math.random*100)
}


let moveRate = 9;
let turnRate = 5;

let angle = 0;



let player1Id = uuidv4();
let player2Id = uuidv4();

// helper functions for gameplay
function updatePosition(offset) {
  let rad = angle * (Math.PI/180);
  position.x += (Math.sin(rad) * offset);
  position.y -= (Math.cos(rad) * offset);

  if (position.x < 0) {
    position.x = 399;
  } else if (position.x > 399) {
    position.x = 0;
  }

  if (position.y < 0) {
    position.y = 399;
  } else if (position.y > 399) {
    position.y = 0;
  }
}

// first collectible for testing
let trivia;

trivia = new Collectible(initialCollectibleLocation.x,initialCollectibleLocation.y,10,uuidv4())

// Function that will draw the elements into the html canvas in context variable
const draw = () => {
  context.clearRect(0, 0 ,canvas.width, canvas.height);

  // Setting the background color
  context.fillStyle = '#220';
  context.fillRect(0,0, canvas.width, canvas.height);

  // Title for the canvas
  context.font = `16px 'Press Start 2P'`;
  context.fillText('Coin Race', canvasCalcs.canvasWidth /2,40)

  // Creates border for the canvas using the default settings in canvas-data.mjs
  context.strokeStyle = 'white';
  context.strokeRect(canvasCalcs.playFieldMinX, canvasCalcs.playFieldMinY, canvasCalcs.playFieldWidth, canvasCalcs.playFieldHeight);

  // Canvas settings for the text
  context.font = `13px 'Press Start 2P'`;
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText('Controls: WASD', 100, 32.5)

  // Drawing the items to the canvas
  trivia.draw(context,{bronzeCoinArt,silverCoinArt,goldCoinArt});


}



// Create the initial collectible
let collectibleTest = new Collectible(initialCollectibleLocation.x,initialCollectibleLocation.y,10,uuidv4())

let playertest = new Player(playerPosition.x,playerPosition.y,defaultStartScore,player1Id)
let playertest2 = new Player(100,100,0,uuidv4())

window.addEventListener("keydown", function(event) {
  if (event.defaultPrevented) {
    return; // Do nothing if event already handled
  }

  switch(event.code) {
    case "KeyS":
    case "ArrowDown":
      // Handle "back"
      playertest.movePlayer('down');
      alert('S key was pressed')
      break;
    case "KeyW":
    case "ArrowUp":
      // Handle "forward"
      playertest.movePlayer('up');
      alert('W key was pressed')
      break;
    case "KeyA":
    case "ArrowLeft":
      // Handle "turn left"
      playertest.movePlayer('left');
      alert('A key was pressed')
      break;
    case "KeyD":
    case "ArrowRight":
      // Handle "turn right"
      playertest.movePlayer('right');
      alert('D key was pressed')
      break;
  }

  // Consume the event so it doesn't get handled twice
  event.preventDefault();
}, true);

draw();



