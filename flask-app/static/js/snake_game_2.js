// Gamepad variables
let gamepad;

// Check for gamepad support
function checkGamepadSupport() {
  if (navigator.getGamepads) {
    // Start listening for gamepad events
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
  } else {
    console.log("Gamepad API not supported");
  }
}

// Handle gamepad connection
function onGamepadConnected(event) {
  gamepad = event.gamepad;
  console.log("Gamepad connected:", gamepad);
  gamepadLoop();
}

// Handle gamepad disconnection
function onGamepadDisconnected(event) {
  console.log("Gamepad disconnected:", event.gamepad);
  gamepad = undefined;
}

// Gamepad loop
function gamepadLoop() {
  checkGamepadInput();
  requestAnimationFrame(gamepadLoop);
}


function checkGamepadInput() {
  if (gamepad) {
    const axes = gamepad.axes;

    // Control the first snake with the left joystick
    if (axes[0] < -0.5 && snakes[0].direction !== "right") {
      snakes[0].direction = "left";
    } else if (axes[0] > 0.5 && snakes[0].direction !== "left") {
      snakes[0].direction = "right";
    }else if (axes[1] < -0.5 && snakes[0].direction !== "down") {
      snakes[0].direction = "up";
    } else if (axes[1] > 0.5 && snakes[0].direction !== "up") {
      snakes[0].direction = "down";
    }
  }
}

// Call the checkGamepadSupport function to start listening for gamepad events
checkGamepadSupport();

// Game variables
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const boxSize = 20;
const canvasSize = canvas.width / boxSize;
let snakes = [
  {
    body: [{
      x: 10,
      y: 10
    }],
    direction: "right",
    score: 0
  },
  {
    body: [{
      x: 10,
      y: 15
    }],
    direction: "right",
    score: 0
  }
];
let foods = [];

// Snake images
const headImage1 = new Image(); // Snake 1 head image
headImage1.src = "../static/Snakes/snake_hooft_blauw.png";

const headImage2 = new Image(); // Snake 2 head image
headImage2.src = "../static/Snakes/snake_hooft_groen.png";

const bodyImage1 = new Image(); // Snake 1 body image
bodyImage1.src = "../static/Snakes/snake_lichaam_blauw.png";

const bodyImage2 = new Image(); // Snake 2 body image
bodyImage2.src = "../static/Snakes/snake_lichaam_groen.png";

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
    if (dx > 0 && snakes[1].direction !== "left") {
      snakes[1].direction = "right";
    } else if (dx < 0 && snakes[1].direction !== "right") {
      snakes[1].direction = "left";
    }
  } else {
    if (dy > 0 && snakes[1].direction !== "up") {
      snakes[1].direction = "down";
    } else if (dy < 0 && snakes[1].direction !== "down") {
      snakes[1].direction = "up";
    }
  }

  touchStartX = null;
  touchStartY = null;
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
  snakes.forEach(function (snake, snakeIndex) {
    const head = {
      x: snake.body[0].x,
      y: snake.body[0].y
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

    // Check if the snake eats its corresponding food
    const foodIndex = foods.findIndex(food => food.x === head.x && food.y === head.y);
    if (foodIndex !== -1) {
      foods.splice(foodIndex, 1);
      snake.score++;
      generateFood();
    } else {
      snake.body.pop();
    }
  });
}


// Draw the snakes
function drawSnakes() {
  snakes.forEach(function (snake, snakeIndex) {
    snake.body.forEach(function (segment, segmentIndex) {
      const segmentImage = getSnakeSegmentImage(segmentIndex, snakeIndex);
      const x = segment.x * boxSize;
      const y = segment.y * boxSize;
      context.drawImage(segmentImage, x, y, boxSize, boxSize);
    });
  });
}

// Get the image for the snake segment based on its position
function getSnakeSegmentImage(segmentIndex, snakeIndex) {
  if (segmentIndex === 0) {
    const headImage = (snakeIndex === 0) ? headImage1 : headImage2;
    return rotateHeadImage(headImage, snakes[snakeIndex].direction);
  } else {
    const bodyImage = (snakeIndex === 0) ? bodyImage1 : bodyImage2;
    return bodyImage;
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
  foods = [];

  const food = {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
    color: randomColor
  };
  foods.push(food);
}


// Draw the food
function drawFood() {
  foods.forEach(function (food) {
    context.fillStyle = food.color;
    context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
  });
}


function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerHTML = `
    <span class="label-blue">Snake 1: ${snakes[0].score}</span>
    |
    <span class="label-green">Snake 2: ${snakes[1].score}</span>
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
  const dialog = document.querySelector(".game-over-dialog");
  
  // Remove existing dialog if present
  if (dialog) {
    document.body.removeChild(dialog);
  }
  
  // Create and append game over dialog
  const gameOverDialog = document.createElement("div");
  gameOverDialog.className = "game-over-dialog";
  
  snakes.forEach(function (snake, index) {
    const scoreElement = document.createElement("p");
    scoreElement.textContent = `Snake ${index + 1} Score: ${snake.score}`;
    gameOverDialog.appendChild(scoreElement);
  });
  
  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", redirectToGameOver);
  gameOverDialog.appendChild(playAgainButton);
  
  document.body.appendChild(gameOverDialog);
}

// Redirect to the game over HTML file
function redirectToGameOver() {
  window.location.href = "/start";
}

generateFood();
// Start the game
gameLoop();
