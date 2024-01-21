let CANVAS = document.getElementById("canvas");

let ROWS = 30;
let COLS = 50;
let PIXEL = 10;

let pixels = new Map();

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

// console.log(pixels);

initializeCanvas();

function drawSnake(snake) {
  let snakePositions = new Set();
  for (let [top, left] of snake) {
    let position = top + "_" + left;
    snakePositions.add(position);
  }
  console.log(snakePositions);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = i + "_" + j;
      let pixel = pixels.get(position);
      pixel.style.background = snakePositions.has(position) ? "black" : "white";
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

let moveRight = ([t, l]) => [t, l+1]
let moveLeft = ([t, l]) => [t, l-1]
let moveTop = ([t, l]) => [t-1, l]
let moveBottom = ([t, l]) => [t+1, l]

let currentDirection = moveRight;
// console.log(currentDirection);

const step = () => {
  currentSnake.shift()
  let head = currentSnake[currentSnake.length - 1]
  let nextHead = currentDirection(head)
  currentSnake.push(nextHead)
  drawSnake(currentSnake)
}

drawSnake(currentSnake)
// setInterval(() => {
//   step()
// }, 1000);
