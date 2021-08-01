import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { generateStartPos, canvasCalcs } from './canvas-data.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

// Function I have found online that will generate a uuidv4 unique id
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Preloading game assets (images etc)
const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

const bronzeCoinArt = loadImage(
  'https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png'
);
const silverCoinArt = loadImage(
  'https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png'
);
const goldCoinArt = loadImage(
  'https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png'
);
const mainPlayerArt = loadImage(
  'https://cdn.freecodecamp.org/demo-projects/images/main-player.png'
);
const otherPlayerArt = loadImage(
  'https://cdn.freecodecamp.org/demo-projects/images/other-player.png'
);

// Below is the game settings for testing
// let playerSize = {
//   width: 30,
//   height: 30,
// };

// let playerPosition = {
//   x: 200,
//   y: 200,
// };

// let defaultStartScore = 0;
// let initialCollectibleLocation = {
//   x: Math.floor(Math.random * 100),
//   y: Math.floor(Math.random * 100),
// };

// let moveRate = 9;
// let turnRate = 5;

// let angle = 0;

// let player1Id = uuidv4();
// let player2Id = uuidv4();

// // helper functions for gameplay
// function updatePosition(offset) {
//   let rad = angle * (Math.PI / 180);
//   position.x += Math.sin(rad) * offset;
//   position.y -= Math.cos(rad) * offset;

//   if (position.x < 0) {
//     position.x = 399;
//   } else if (position.x > 399) {
//     position.x = 0;
//   }

//   if (position.y < 0) {
//     position.y = 399;
//   } else if (position.y > 399) {
//     position.y = 0;
//   }
// }

// first collectible for testing
let tick;
let currPlayers = [];
let item;
let endGame;

// trivia = new Collectible(initialCollectibleLocation.x,initialCollectibleLocation.y,10,uuidv4())

socket.on('init', ({ id, players, coin }) => {
  console.log(`Connected ${id}`);

  // Cancel animation if one already exists and
  // the page isn't refreshed, like if the server
  // restarts
  cancelAnimationFrame(tick);

  // Create our player when we log on
  const mainPlayer = new Player({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5
    ),
    id,
    main: true,
  });

  controls(mainPlayer, socket);

  // Send our player back to the server
  socket.emit('new-player', mainPlayer);

  // Add new player when someone logs on
  socket.on('new-player', (obj) => {
    // Check that player doesn't already exist
    const playerIds = currPlayers.map((player) => player.id);
    if (!playerIds.includes(obj.id)) currPlayers.push(new Player(obj));
  });

  // Handle movement
  socket.on('move-player', ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find((obj) => obj.id === id);
    movingPlayer.moveDir(dir);

    // Force sync in case of lag
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });

  socket.on('stop-player', ({ id, dir, posObj }) => {
    const stoppingPlayer = currPlayers.find((obj) => obj.id === id);
    stoppingPlayer.stopDir(dir);

    // Force sync in case of lag
    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  // Handle new coin gen
  socket.on('new-coin', (newCoin) => {
    item = new Collectible(newCoin);
  });

  // Handle player disconnection
  socket.on('remove-player', (id) => {
    console.log(`${id} disconnected`);
    currPlayers = currPlayers.filter((player) => player.id !== id);
  });

  // Handle endGame state
  socket.on('end-game', (result) => (endGame = result));

  // Update scoring player's score
  socket.on('update-player', (playerObj) => {
    const scoringPlayer = currPlayers.find((obj) => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  });

  // Populate list of connected players and
  // create current coin when logging in
  currPlayers = players.map((val) => new Player(val)).concat(mainPlayer);
  item = new Collectible(coin);

  draw();
});

// Function that will draw the elements into the html canvas in context variable
const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set background color
  context.fillStyle = '#220';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create border for play field
  context.strokeStyle = 'white';
  context.strokeRect(
    canvasCalcs.playFieldMinX,
    canvasCalcs.playFieldMinY,
    canvasCalcs.playFieldWidth,
    canvasCalcs.playFieldHeight
  );

  // Controls text
  context.fillStyle = 'white';
  context.font = `13px 'Press Start 2P'`;
  context.textAlign = 'center';
  context.fillText('Controls: WASD', 100, 32.5);

  // Game title
  context.font = `16px 'Press Start 2P'`;
  context.fillText('Coin Race', canvasCalcs.canvasWidth / 2, 32.5);

  // Calculate score and draw players each frame
  currPlayers.forEach((player) => {
    player.draw(context, item, { mainPlayerArt, otherPlayerArt }, currPlayers);
  });

  // Draw current coin
  item.draw(context, { bronzeCoinArt, silverCoinArt, goldCoinArt });

  // Remove destroyed coin
  if (item.destroyed) {
    socket.emit('destroy-item', {
      playerId: item.destroyed,
      coinValue: item.value,
      coinId: item.id,
    });
  }

  if (endGame) {
    context.fillStyle = 'white';
    context.font = `13px 'Press Start 2P'`;
    context.fillText(
      `You ${endGame}! Restart and try again.`,
      canvasCalcs.canvasWidth / 2,
      80
    );
  }

  if (!endGame) tick = requestAnimationFrame(draw);
};

// Testing part
// Create the initial collectible
// let collectibleTest = new Collectible(
//   initialCollectibleLocation.x,
//   initialCollectibleLocation.y,
//   10,
//   uuidv4()
// );

// Testing part
// let playertest = new Player(
//   playerPosition.x,
//   playerPosition.y,
//   defaultStartScore,
//   player1Id
// );
// let playertest2 = new Player(100, 100, 0, uuidv4());

// window.addEventListener(
//   'keydown',
//   function (event) {
//     if (event.defaultPrevented) {
//       return; // Do nothing if event already handled
//     }

//     switch (event.code) {
//       case 'KeyS':
//       case 'ArrowDown':
//         // Handle "back"
//         playertest.movePlayer('down');
//         alert('S key was pressed');
//         break;
//       case 'KeyW':
//       case 'ArrowUp':
//         // Handle "forward"
//         playertest.movePlayer('up');
//         alert('W key was pressed');
//         break;
//       case 'KeyA':
//       case 'ArrowLeft':
//         // Handle "turn left"
//         playertest.movePlayer('left');
//         alert('A key was pressed');
//         break;
//       case 'KeyD':
//       case 'ArrowRight':
//         // Handle "turn right"
//         playertest.movePlayer('right');
//         alert('D key was pressed');
//         break;
//     }

//     // Consume the event so it doesn't get handled twice
//     event.preventDefault();
//   },
//   true
// );
