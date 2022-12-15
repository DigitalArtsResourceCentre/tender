const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const lines = [];

const colors = [
  ['#5353d6', '#0000ff'],
  ['#54acc8', '#00bfff'],
  ['#00b8d4', '#00f0ff'],
  ['#006064', '#00e5ff'],
  ['#00e5ff', '#00bcd4'],
  ['#00b8d4', '#00f0ff'],
  ['#00bcd4', '#00ffff'],
  ['#00acc1', '#00e5ff'],
  ['#00b8d4', '#00ffff'],
  ];


var colorIndex = -1;

var step = 0,
width = 0,
height = 0;

document.ontouchstart = color;
document.onmousedown = color;
window.onresize = setup;

setup();
color();
update();

function setup() {

  width = window.innerWidth,
  height = window.innerHeight;

  lines.length = 0;

  let lineCount = height / 16;
  let pointCount = 14;
  let spacingH = width / pointCount;
  let spacingV = height / lineCount;

  for (let v = 0; v < lineCount; v++) {

    let line = { points: [], ran: 0.2 + Math.random() * 0.7 };

    for (let h = 0; h < pointCount; h++) {
      line.points.push({
        nx: h * spacingH,
        ny: v * spacingV });

    }

    line.points.push({
      nx: width + spacingH,
      ny: v * spacingV });


    lines.push(line);

  }

}

function color() {

  colorIndex = ++colorIndex % colors.length;
  canvas.style.backgroundColor = colors[colorIndex][0];
//   let bullets = document.getElementById("");
//   bullets.style.backgroundColor = colors[colorIndex][0];

}

function update() {

  step += 0.8;

  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);

  context.lineWidth = 2;
  context.strokeStyle = colors[colorIndex][1];
  context.fillStyle = colors[colorIndex][0];

  lines.forEach((line, v) => {

    context.beginPath();

    line.points.forEach((point, h) => {

      point.x = point.nx,
      point.y = point.ny + Math.sin((point.x * line.ran + (step + point.ny)) / 40) * (6 + point.ny / height * 34);

    });

    line.points.forEach((point, h) => {

      let nextPoint = line.points[h + 1];

      if (h === 0) {
        context.moveTo(point.x, point.y);
      } else
      if (nextPoint) {
        let cpx = point.x + (nextPoint.x - point.x) / 2;
        let cpy = point.y + (nextPoint.y - point.y) / 2;
        context.quadraticCurveTo(point.x, point.y, cpx, cpy);
      }

    });

    context.stroke();

    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();
    context.fill();

  });

  requestAnimationFrame(update);

}