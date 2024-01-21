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

drawSnake([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]]);

function drawSnake(snake) {
  let snakePositions = new Set();
  for (let [x, y] of snake) {
    let position = x + "_" + y;
    snakePositions.add(position);
  }
  console.log(snakePositions);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = i + "_" + j;
      let pixel = pixels.get(position);
      pixel.style.background = snakePositions.has(position) ? 'black' : 'white'
    }
  }
}
