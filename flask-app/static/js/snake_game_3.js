// Game variables
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const boxSize = 20;
const canvasSize = canvas.width / boxSize;

// var socket = io.connect();  // Connect to the SocketIO server

// socket.on('button_state', function(buttonState) {
//     // Handle the received button state
//     console.log('Received button state:', buttonState);
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const socket = io();
//   const gameContainer = document.getElementById('game-container');

//   // Listen for GPIO button state updates from the server
//   socket.on('button_state', buttonState => {
//       if (buttonState === 'button1_pressed') {
//           sendMovement('up');
//       } else if (buttonState === 'button2_pressed') {
//           sendMovement('right');
//       } else if (buttonState === 'button3_pressed') {
//           sendMovement('down');
//       } else if (buttonState === 'button4_pressed') {
//           sendMovement('left');
//       } else {
        
//       }
//   });

//   // Function to send movement information to the server
//   function sendMovement(direction) {
//       socket.emit('movement', direction);
//   }


// });

let snakes = [
  {
    body: [{ x: 10, y: 10 }],
    direction: "right",
    score: 0,
    headImage: new Image(),
    bodyImage: new Image()
  },
  {
    body: [{ x: 10, y: 15 }],
    direction: "right",
    score: 0,
    headImage: new Image(),
    bodyImage: new Image()
  },
  {
    body: [{ x: 15, y: 10 }],
    direction: "left",
    score: 0,
    headImage: new Image(),
    bodyImage: new Image()
  },
];
let food = {
  x: Math.floor(Math.random() * canvasSize),
  y: Math.floor(Math.random() * canvasSize),
};

// Snake images
snakes[0].headImage.src = "../static/Snakes/snake_hooft_blauw.png";
snakes[0].bodyImage.src = "../static/Snakes/snake_lichaam_blauw.png";

snakes[1].headImage.src = "../static/Snakes/snake_hooft_groen.png";
snakes[1].bodyImage.src = "../static/Snakes/snake_lichaam_groen.png";

snakes[2].headImage.src = "../static/Snakes/snake_hooft_oragne.png";
snakes[2].bodyImage.src = "../static/Snakes/snake_lichaam_oragne.png";

// Handle keyboard events
document.addEventListener("keydown", changeDirection);

// Handle touch events
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

let touchStartX = null;
let touchStartY = null;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) return;

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && snakes[0].direction !== "left") {
      snakes[0].direction = "right";
    } else if (dx < 0 && snakes[0].direction !== "right") {
      snakes[0].direction = "left";
    }
  } else {
    if (dy > 0 && snakes[0].direction !== "up") {
      snakes[0].direction = "down";
    } else if (dy < 0 && snakes[0].direction !== "down") {
      snakes[0].direction = "up";
    }
  }

  touchStartX = null;
  touchStartY = null;
}

function changeDirection(event) {
  const key = event.keyCode;

  // Control the second snake with z, s, q, d keys
  if (key === 90 && snakes[1].direction !== "down") {
    snakes[1].direction = "up";
  } else if (key === 83 && snakes[1].direction !== "up") {
    snakes[1].direction = "down";
  } else if (key === 81 && snakes[1].direction !== "right") {
    snakes[1].direction = "left";
  } else if (key === 68 && snakes[1].direction !== "left") {
    snakes[1].direction = "right";
  }

  // Control the third snake with arrow keys
  if (key === 37 && snakes[2].direction !== "right") {
    snakes[2].direction = "left";
  } else if (key === 38 && snakes[2].direction !== "up") {
    snakes[2].direction = "down";
  } else if (key === 39 && snakes[2].direction !== "left") {
    snakes[2].direction = "right";
  } else if (key === 40 && snakes[2].direction !== "down") {
    snakes[2].direction = "up";
  }
}

// Game loop
function gameLoop() {
  setTimeout(function () {
    clearCanvas();
    moveSnakes();
    drawSnakes();
    drawFood();
    updateScore();
    if (!gameOver()) {
      gameLoop();
    }
  }, 100);
}

// Clear canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Move the snakes
function moveSnakes() {
  snakes.forEach(function (snake) {
    const head = {
      x: snake.body[0].x,
      y: snake.body[0].y,
    };

    if (snake.direction === "right") {
      head.x++;
    } else if (snake.direction === "left") {
      head.x--;
    } else if (snake.direction === "up") {
      head.y--;
    } else if (snake.direction === "down") {
      head.y++;
    }

    snake.body.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      snake.score++;
      generateFood();
    } else {
      snake.body.pop();
    }
  });
}

// Draw the snakes
function drawSnakes() {
  snakes.forEach(function (snake, index) {
    snake.body.forEach(function (segment, segmentIndex) {
      const segmentImage = getSnakeSegmentImage(index, segmentIndex);
      const x = segment.x * boxSize;
      const y = segment.y * boxSize;

      context.drawImage(segmentImage, x, y, boxSize, boxSize);
    });
  });
}

// Get the image for the snake segment based on its position
function getSnakeSegmentImage(snakeIndex, segmentIndex) {
  if (segmentIndex === 0) {
    return rotateHeadImage(snakes[snakeIndex].headImage, snakes[snakeIndex].direction);
  } else {
    return snakes[snakeIndex].bodyImage;
  }
}

// Rotate the head image based on the snake's direction
function rotateHeadImage(image, direction) {
  const rotatedImage = document.createElement("canvas");
  rotatedImage.width = boxSize;
  rotatedImage.height = boxSize;
  const ctx = rotatedImage.getContext("2d");
  ctx.translate(boxSize / 2, boxSize / 2);

  if (direction === "right") {
    ctx.rotate(Math.PI / 2);
  } else if (direction === "left") {
    ctx.rotate((3 * Math.PI) / 2);
  } else if (direction === "down") {
    ctx.rotate(Math.PI);
  }

  ctx.drawImage(image, -boxSize / 2, -boxSize / 2, boxSize, boxSize);
  return rotatedImage;
}

const fruitColors = ["#F60000", "#FF8C00", "#FFEE00", "#4DE94C", "#3783FF", "#4815AA"];

// Generate food at a random location with a random color
function generateFood() {
  const randomColor = fruitColors[Math.floor(Math.random() * fruitColors.length)];
  food = {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
    color: randomColor,
  };
}

// Draw the food
function drawFood() {
  context.fillStyle = food.color;
  context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `
    <span class="label-blue">Snake 1: ${snakes[0].score}</span>
    |
    <span class="label-green">Snake 2: ${snakes[1].score}</span>
    |
    <span class="label-orange">Snake 3: ${snakes[2].score}</span>
  `;
}

// Check if the game is over
function gameOver() {
  let isGameOver = false;

  snakes.forEach(function (snake) {
    const head = snake.body[0];

    // Check if the snake hits the wall
    if (
      head.x < 0 ||
      head.x >= canvasSize ||
      head.y < 0 ||
      head.y >= canvasSize
    ) {
      isGameOver = true;
    }

    // Check if the snake hits itself
    for (let i = 1; i < snake.body.length; i++) {
      if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
        isGameOver = true;
      }
    }
  });

  if (isGameOver) {
    showGameOverDialog();
    return true;
  }

  return false;
}

// Show the game over dialog
function showGameOverDialog() {
  const dialog = document.createElement("div");
  dialog.className = "game-over-dialog";

  snakes.forEach(function (snake, index) {
    const scoreElement = document.createElement("p");
    scoreElement.textContent = `Snake ${index + 1} Score: ${snake.score}`;
    dialog.appendChild(scoreElement);
  });

  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", redirectToGameOver);
  dialog.appendChild(playAgainButton);

  document.body.appendChild(dialog);
}

// Redirect to the game over HTML file
function redirectToGameOver() {
  window.location.href = "/start";
}

generateFood();
// Start the game
gameLoop();
