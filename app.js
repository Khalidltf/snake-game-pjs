let CANVAS = document.getElementById("canvas");

let ROWS = 30;
let COLS = 50;
let PIXEL = 10;
let pixels = new Map();
let gameInterval = null;
let moveRight = ([t, l]) => [t, l + 1];
let moveLeft = ([t, l]) => [t, l - 1];
let moveUp = ([t, l]) => [t - 1, l];
let moveDown = ([t, l]) => [t + 1, l];

//  drawing the canvas
function initializeCanvas() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let pixel = document.createElement("div");
      pixel.style.position = "absolute";
      pixel.style.border = "1px solid #aaa";
      pixel.style.left = j * PIXEL + "px";
      pixel.style.top = i * PIXEL + "px";
      pixel.style.width = PIXEL + "px";
      pixel.style.height = PIXEL + "px";
      let key = toKey([i, j]);
      CANVAS.appendChild(pixel);
      pixels.set(key, pixel);
    }
  }
}

initializeCanvas();

function drawCanvas() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let key = toKey([i, j]);
      let pixel = pixels.get(key);
      let background = "white";
      if (key === currentFoodKey) {
        background = "purple";
      } else if (currentSnakeKeys.has(key)) {
        background = "black";
      }
      pixel.style.background = background;
    }
  }

  dump({
    currentSnake,
    snakeKeys: Array.from(currentSnakeKeys),
    vacantKeys: Array.from(currentVacantKeys),
    foodKey: currentFoodKey
  })
}

let currentSnake;
let currentSnakeKeys;
let currentVacantKeys;
// we define a coordinate food
let currentFoodKey;
let currentDirection;
let directionQueue;

/* const updateSnake = (nextSnake) => {
  currentSnake = nextSnake
  currentSnakeKeys = toKeySet(nextSnake);
} */

/* let currentDirection = moveRight;
 let flushedDirection = currentDirection */
// console.log(currentDirection);

window.addEventListener("keydown", (e) => {
  if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
    return;
  }
  e.preventDefault();
  switch (e.key) {
    case "ArrowLeft":
    case "A":
    case "a":
      directionQueue.push(moveLeft);
      break;
    case "ArrowRight":
    case "d":
    case "D":
      directionQueue.push(moveRight);
      break;
    case "ArrowUp":
    case "w":
    case "W":
      directionQueue.push(moveUp);
      break;
    case "ArrowDown":
    case "S":
    case "s":
      directionQueue.push(moveDown);
      break;
    case "r":
    case "R":
      stopGame(false);
      startGame();
      break;
    case " ":
      step();
      break;
  }
});

const step = () => {
  let head = currentSnake[currentSnake.length - 1];
  let nextDirection = currentDirection;
  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();
    if (!areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;
      break;
    }
  }
  currentDirection = nextDirection;
  // next head
  let nextHead = currentDirection(head);
  // we check if the next head is a valid position
  // we continue if it's not we stop the game
  // we'll define a checkValidHead n stopGame functions below
  if (!checkValidHead(currentSnakeKeys, nextHead)) {
    stopGame(false);
    return;
  }

  currentSnake.push(nextHead);
  if (toKey(nextHead) == currentFoodKey) {
    let nextFoodKey = spawnFood();
    if (nextFoodKey === null) {
      stopGame(true);
      return;
    }
    currentFoodKey = nextFoodKey;
  } else {
    currentSnake.shift();
  }

  updateKeySets();
  drawCanvas();
};

function updateKeySets(snake) {
  currentSnakeKeys = new Set();
  currentVacantKeys = new Set();
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      currentVacantKeys.add(toKey([i, j]));
    }
  }

  for (let cell of currentSnake) {
    let key = toKey(cell);
    currentVacantKeys.delete(key);
    currentSnakeKeys.add(key);
  }
}

function spawnFood() {
  if (currentVacantKeys.size === 0) {
    return null;
  }
  let choice = Math.floor(Math.random() * currentVacantKeys.size);
  let i = 0;
  for (let key of currentVacantKeys) {
    if (i === choice) {
      return key;
    }
    i++;
  }
  throw Error("should never get here");
}

const areOpposite = (dir1, dir2) => {
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }
  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  }
  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }
  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }
  return false;
};

const checkValidHead = (keys, cell) => {
  let [top, left] = cell;
  /* if top or left position is less than 0 (outside the grid) it's not valid */
  if (top < 0 || left < 0) {
    return false;
  }
  /* if top or left position is greater than the number of rows or columns, it isn't valid */
  if (top >= ROWS || left >= COLS) {
    return false;
  }
  // we draw the current position
  if (keys.has(toKey(cell))) {
    return false;
  }
  /*if top and left are within the grid, it's valid head's position */
  return true;
};

function stopGame(success) {
  // we add to the canvas border style red color
  CANVAS.style.borderColor = success ? "green" : "red";
  clearInterval(gameInterval);
}

function startGame() {
  directionQueue = [];
  currentDirection = moveRight;
  currentSnake = makeInitialSnake();
  currentSnakeKeys = new Set();
  currentVacantKeys = new Set();
  updateKeySets();
  currentFoodKey = spawnFood();

  CANVAS.style.border = "";
  // gameInterval = setInterval(step, 50);
  drawCanvas();
}

startGame();

function makeInitialSnake() {
  return [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ];
}

function toKey([top, left]) {
  return top + "_" + left;
}

function dump(obj) {
  document.getElementById("debug").innerText = JSON.stringify(obj, null, 2);
}
