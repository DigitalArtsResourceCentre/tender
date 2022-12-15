// Create the canvas and set its dimensions
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the 2D rendering context for the canvas
var ctx = canvas.getContext('2d');

// Create an array of rainbow colors
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

// Set the initial position and velocity of the waves
var x = 0;
var y = 0;
var vx = 0.5;
var vy = 0.5;

// This function is called every time the canvas needs to be updated
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through the rainbow colors
  for (var i = 0; i < colors.length; i++) {
    // Set the fill style to the current color
    ctx.fillStyle = colors[i];

    // Draw a wave
    ctx.beginPath();
    ctx.moveTo(x + i * 20, y + i * 10);
    ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2, x + i * 20, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, y + i * 10);
    ctx.fill();
  }

  // Update the position of the waves
  x += vx;
  y += vy;

  // If the waves have reached the edge of the canvas, reverse their direction
  if (x + colors.length * 20 > canvas.width || x < 0) {
    vx *= -1;
  }
  if (y + colors.length * 10 > canvas.height || y < 0) {
    vy *= -1;
  }

  // Request another update
  requestAnimationFrame(update);
}

// Start the animation
update();

// Add the canvas to the page
document.body.appendChild(canvas);
