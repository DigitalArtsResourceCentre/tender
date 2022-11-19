var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

let rotationSpeed = 0.09;
let mousePos = vec2.fromValues(0, 0);

let hoveredClock = null;

let clockPositions = []

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

color();
boom();

window.addEventListener('resize', () => {
  clockPositions = [];
  console.log(clockPositions);
})

function color() {
  console.log(rotationSpeed);
  rotationSpeed = rotationSpeed * 2;
  console.log(rotationSpeed);
  colorIndex = (++colorIndex) % colors.length;
  canvas.style.backgroundColor = colors[colorIndex][0];
  // boom();
}

function isHoveredClock(x, y) {
  return hoveredClock && hoveredClock.cell.x == x && hoveredClock.cell.y == y
}

function boom() {
  var width = window.innerWidth,
    height = window.innerHeight;

  var vmin = Math.min(width, height) / 100;

  var dpr = window.devicePixelRatio;
  if (dpr > 1) {
    width *= dpr;
    height *= dpr;
    vmin *= dpr;
  }

  canvas.width = width;
  canvas.height = height;

  // Cell size + spacing
  var cellSize = vmin * 18;
  var cellSpacing = cellSize * 0.3;
  var cellSizeWithSpacing = cellSize + cellSpacing;

  // Clock hands
  var longHandLength = cellSize * 0.4;
  var shortHandLength = cellSize * 0.25;
  var thickness = Math.round(longHandLength / 18);

  // Margin around the screen edge
  var margin = vmin;

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = thickness;
  context.strokeStyle = colors[colorIndex][1];
  context.clearRect(0, 0, width, height);

  step += 1;

  var cols = Math.floor((width - margin * 2) / cellSizeWithSpacing),
    rows = Math.floor((height - margin * 2) / cellSizeWithSpacing);

  var ox = (width - (cols * cellSizeWithSpacing) + cellSpacing) / 2,
    oy = (height - (rows * cellSizeWithSpacing) + cellSpacing) / 2;

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
        console.log(clockPositions[clockPositions.length - 1]);
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


  function handleMouseMove(e) {
    vec2.set(mousePos, e.clientX, e.clientY);

    let hasOne = false;

    for (let i = 0; i < clockPositions.length; i++) {
      const dist = vec2.dist(mousePos, clockPositions[i].screenPos);

      if (dist < cellSize / 2) {
        hoveredClock = clockPositions[i];
        hasOne = true;
        break;
      }
    }

    if (!hasOne) {
      hoveredClock = null;
    }
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

  window.addEventListener('mousemove', throttled(handleMouseMove));


}
