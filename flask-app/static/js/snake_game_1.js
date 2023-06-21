// Game variables
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const boxSize = 20;
const canvasSize = canvas.width / boxSize;
let snake = [{
  x: 10,
  y: 10
}];
let direction = "right";
let food = {
  x: Math.floor(Math.random() * canvasSize),
  y: Math.floor(Math.random() * canvasSize)
};
let score = 0; // Initialize score variable

// Snake images
const headImage = new Image();
headImage.src = "../static/Snakes/snake_hooft_blauw.png";

const bodyImage = new Image();
bodyImage.src = "../static/Snakes/snake_lichaam_blauw.png";

// Handle keyboard events
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "right") {
    direction = "left";
  } else if (key === 38 && direction !== "down") {
    direction = "up";
  } else if (key === 39 && direction !== "left") {
    direction = "right";
  } else if (key === 40 && direction !== "up") {
    direction = "down";
  }
}

// Game loop
function gameLoop() {
  setTimeout(function () {
    clearCanvas();
    moveSnake();
    drawSnake();
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

// Move the snake
function moveSnake() {
  const head = {
    x: snake[0].x,
    y: snake[0].y
  };

  if (direction === "right") {
    head.x++;
  } else if (direction === "left") {
    head.x--;
  } else if (direction === "up") {
    head.y--;
  } else if (direction === "down") {
    head.y++;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    generateFood();
    score++; // Increase the score when a new fruit is eaten
  } else {
    snake.pop();
  }
}

// Draw the snake
function drawSnake() {
  snake.forEach(function (segment, index) {
    const segmentImage = getSnakeSegmentImage(index);
    const x = segment.x * boxSize;
    const y = segment.y * boxSize;

    context.drawImage(segmentImage, x, y, boxSize, boxSize);
  });
}

// Get the image for the snake segment based on its position
function getSnakeSegmentImage(index) {
  if (index === 0) {
    return rotateHeadImage(headImage);
  } else {
    return bodyImage;
  }
}

// Rotate the head image based on the snake's direction
function rotateHeadImage(image) {
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

// Generate food at a random location
function generateFood() {
  food = {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize)
  };
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

// Update the score on the webpage
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `<span class="label-blue">Snake 1: ${score}</span>`;
}

// Check if the game is over
function gameOver() {
  const head = snake[0];

  // Check if the snake hits the wall
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize
  ) {
    showGameOverDialog();
    return true;
  }

  // Check if the snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      showGameOverDialog();
      return true;
    }
  }

  return false;
}

// Show the game over dialog
function showGameOverDialog() {
  const dialog = document.createElement("div");
  dialog.className = "game-over-dialog";
  dialog.innerHTML = `
    <p>Game over! Your score: ${score}</p>
    <button onclick="redirectToGameOver()">Play Again</button>
  `;
  document.body.appendChild(dialog);
}

// Redirect to the game over HTML file
function redirectToGameOver() {
  window.location.href = "/start";
}

generateFood();
// Start the game
gameLoop();
