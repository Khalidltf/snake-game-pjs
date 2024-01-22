let CANVAS = document.getElementById("canvas");

let ROWS = 30;
let COLS = 50;
let PIXEL = 10;

let pixels = new Map();

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
      let position = i + "_" + j;
      CANVAS.appendChild(pixel);
      pixels.set(position, pixel);
    }
  }
}

initializeCanvas();

function drawSnake() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = i + "_" + j;
      let pixel = pixels.get(position);
      pixel.style.background = currentSnakePositions.has(position) ? "black" : "white";
    }
  }
}

let currentSnake = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
];

let currentSnakePositions = toPositionSet(currentSnake)

/* const updateSnake = (nextSnake) => {
  currentSnake = nextSnake
  currentSnakePositions = toPositionSet(nextSnake);
} */


let moveRight = ([t, l]) => [t, l + 1];
let moveLeft = ([t, l]) => [t, l - 1];
let moveUp = ([t, l]) => [t - 1, l];
let moveDown = ([t, l]) => [t + 1, l];

let currentDirection = moveRight;
let directionQueue = [];

/* let currentDirection = moveRight;
 let flushedDirection = currentDirection */
// console.log(currentDirection);

window.addEventListener("keydown", (e) => {
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
  }
});

const step = () => {
  currentSnake.shift();
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
  if (!checkValidHead(currentSnakePositions, nextHead)) {
    stopGame();
    return;
  }

  currentSnake.push(nextHead);
  currentSnakePositions = toPositionSet(currentSnake);
  drawSnake();
};

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

const checkValidHead = (positions, [top, left]) => {
  /* if top or left position is less than 0 (outside the grid) it's not valid */
  if (top < 0 || left < 0 ) {
    return false
  }
  /* if top or left position is greater than the number of rows or columns, it isn't valid */
  if (top >= ROWS || left >= COLS) {
    return false
  }
  // we draw the current position
  let position = top + '_' + left
  if (positions.has(position)) {
    return false;
  }
  /*if top and left are within the grid, it's valid head's position */
  return true
};

function stopGame() {
  // we add to the canvas border style red color
  CANVAS.style.borderColor = "red";
  clearInterval(gameInterval);
}

drawSnake();
// let gameInterval = setInterval(() => {
//   step()
// }, 100);

function toPositionSet(snake) {
  let set = new Set();
  for (let [top, left] of snake) {
    let position = top + "_" + left;
    set.add(position);
  }
  return set;
}


function dump(obj) {
  document.getElementById("debug").innerText = JSON.stringify(obj);
}
