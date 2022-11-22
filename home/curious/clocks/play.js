var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

let rotationSpeed = 0.09;
let mousePos = vec2.fromValues(0, 0);

let hoveredClock = null;

let clockPositions = []
let sqrdRadius = 0;

var step = 0;
var colorIndex = -1;
var colors = [
  ['#5f0c56', '#964ec9'],
  ['#101e62', '#7675e7'],
  // [ '#f9844a', '#e6e6e6' ],
  // [ '#f9c74f', '#e24c68' ],
  // [ '#90be6d', '#1666bd' ],
  // [ '#43aa8b', '#e55256' ],
  // [ '#4d908e', '#1790d0' ],
  // [ '#577590', '#1790d0' ],
  ['#277da1', '#1790d0']
];

document.ontouchstart = color;
document.onmousedown = color;


function color() {
  // console.log(rotationSpeed);
  // rotationSpeed = rotationSpeed * 2;
  // console.log(rotationSpeed);
  colorIndex = (++colorIndex) % colors.length;
  canvas.style.backgroundColor = colors[colorIndex][0];
  // boom();
}

function isHoveredClock(x, y) {
  return hoveredClock && hoveredClock.cell.x == x && hoveredClock.cell.y == y
}


function throttled(fn) {
  let didRequest = false;
  return param => {
    if (!didRequest) {
      window.requestAnimationFrame(() => {
        fn(param);
        didRequest = false;
      });
      didRequest = true;
    }
  };
}

var width, height;

var vmin;

var dpr;

// Cell size + spacing
var cellSize;
var cellSpacing;
var cellSizeWithSpacing;

// Clock hands
var longHandLength;
var shortHandLength;
var thickness;

// Margin around the screen edge
var margin;

var cols, rows;

var ox, oy;


function setDimensionsVar() {
  clockPositions = [];

  width = window.innerWidth;
  height = window.innerHeight;

  vmin = Math.min(width, height) / 100;

  dpr = window.devicePixelRatio;
  if (dpr > 1) {
    width *= dpr;
    height *= dpr;
    vmin *= dpr;
  }

  canvas.width = width;
  canvas.height = height;

  // Cell size + spacing
  cellSize = vmin * 18;
  cellSpacing = cellSize * 0.3;
  cellSizeWithSpacing = cellSize + cellSpacing;


  sqrdRadius = Math.pow(cellSize / 2, 2)

  console.log("sqrdRadius", Math.sqrt(sqrdRadius));

  // Clock hands
  longHandLength = cellSize * 0.4;
  shortHandLength = cellSize * 0.25;
  thickness = Math.round(longHandLength / 18);

  // Margin around the screen edge
  margin = vmin;

  cols = Math.floor((width - margin * 2) / cellSizeWithSpacing);
  rows = Math.floor((height - margin * 2) / cellSizeWithSpacing);

  ox = (width - (cols * cellSizeWithSpacing) + cellSpacing) / 2;
  oy = (height - (rows * cellSizeWithSpacing) + cellSpacing) / 2;
}

setDimensionsVar();
window.addEventListener('resize', setDimensionsVar)


function boom() {

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = thickness;
  context.strokeStyle = colors[colorIndex][1];
  context.clearRect(0, 0, width, height);

  step += 1;

  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {

      var px = ox + x * cellSizeWithSpacing,
        py = oy + y * cellSizeWithSpacing;

      var dx = px - width / 2;
      var dy = py - height / 2;
      var distanceFromCenter = Math.sqrt(dx * dx + dy * dy) / Math.min(width, height);

      var rotationOffset = distanceFromCenter * 4;
      // var rotationSpeed = 0.009;

      // Move to cell
      context.save();
      context.translate(px + cellSize / 2, py + cellSize / 2);

      if (clockPositions.length < (cols * rows)) {
        let clockPos = vec2.fromValues(px + cellSize / 2, py + cellSize / 2);
        clockPositions.push({ screenPos: clockPos, cell: { x, y } })
      }

      const hovered = isHoveredClock(x, y);

      const clockRotationSpeed = hovered ? rotationSpeed / 20 : rotationSpeed;

      // Outline
      context.beginPath();
      context.arc(0, 0, cellSize / 2, 0, Math.PI * 2);
      if (hovered) {
        context.strokeStyle = 'pink'
      }
      context.stroke();

      // Long hand rotation
      context.save();
      context.rotate(rotationOffset + step * clockRotationSpeed);

      // Draw from the tip of the long hand into the center
      context.beginPath();
      context.moveTo(longHandLength, 0);
      context.lineTo(0, 0);
      context.restore();

      // Short hand rotation
      context.save();


      context.rotate(rotationOffset + step * (clockRotationSpeed / 12));

      // Draw from the center to the tip of the short hand
      context.lineTo(shortHandLength, 0);
      context.stroke();

      context.restore();
      context.restore();

    }
  }

  requestAnimationFrame(boom);
}

function handleMouseMove(e) {
  vec2.set(mousePos, e.clientX, e.clientY);

  let hasOne = false;

  for (let i = 0; i < clockPositions.length; i++) {
    const dist = vec2.sqrDist(mousePos, clockPositions[i].screenPos);

    if (dist < sqrdRadius) {
      hoveredClock = clockPositions[i];
      hasOne = true;
      break;
    }
  }

  if (!hasOne) {
    hoveredClock = null;
  }
}
window.addEventListener('mousemove', throttled(handleMouseMove));

color();
boom();
