var canvas = document.querySelector( 'canvas' );
var context = canvas.getContext( '2d' );

var step = 0;
var colorIndex = -1;
var colors = [
  [ '#fff', '#111' ],
  [ '#e37169', '#26282a' ],
  [ '#eed87b', '#28292b' ],
  [ '#0d5b5c', '#e6e6e6' ],
  [ '#d4e8e1', '#e24c68' ],
  [ '#fbfc65', '#1666bd' ],
  [ '#4f3a4b', '#e55256' ],
  [ '#f3c8ed', '#1790d0' ],
  [ '#111', '#fff' ]
];

document.ontouchstart = color;
document.onmousedown = color;

color();
boom();

function color() {

  colorIndex = ( ++colorIndex ) % colors.length;
  canvas.style.backgroundColor = colors[colorIndex][0];

}

function boom() {

  var width = window.innerWidth,
      height = window.innerHeight;

  var vmin = Math.min( width, height ) / 100;

  var dpr = window.devicePixelRatio;
  if( dpr > 1 ) {
    width *= dpr;
    height *= dpr;
    vmin *= dpr;
  }

  canvas.width = width;
  canvas.height = height;

  // Cell size + spacing
  var cellSize = vmin * 10;
  var cellSpacing = cellSize * 0.3;
  var cellSizeWithSpacing = cellSize + cellSpacing;

  // Clock hands
  var longHandLength = cellSize * 0.4;
  var shortHandLength = cellSize * 0.25;
  var thickness = Math.round( longHandLength / 8 );

  // Margin around the screen edge
  var margin = vmin;

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = thickness;
  context.strokeStyle = colors[colorIndex][1];
  context.clearRect( 0, 0, width, height );

  step += 1;

  var cols = Math.floor( ( width - margin*2 ) / cellSizeWithSpacing ),
      rows = Math.floor( ( height - margin*2 ) / cellSizeWithSpacing );

  var ox = ( width - ( cols * cellSizeWithSpacing ) + cellSpacing ) / 2,
      oy = ( height - ( rows * cellSizeWithSpacing ) + cellSpacing ) / 2;

  for( var x = 0; x < cols; x++ ) {
    for( var y = 0; y < rows; y++ ) {

      var px = ox + x * cellSizeWithSpacing,
          py = oy + y * cellSizeWithSpacing;

      var dx = px - width/2;
      var dy = py - height/2;
      var distanceFromCenter = Math.sqrt( dx*dx + dy*dy ) / Math.min( width, height );

      var rotationOffset = distanceFromCenter * 4;
      var rotationSpeed = 0.05;

      // Move to cell
      context.save();
      context.translate( px + cellSize/2, py + cellSize/2 );

      // Outline
      context.beginPath();
      context.arc( 0, 0, cellSize/2, 0, Math.PI*2 );
      context.stroke();

      // Long hand rotation
      context.save();
      context.rotate( rotationOffset + step * rotationSpeed );

      // Draw from the tip of the long hand into the center
      context.beginPath();
      context.moveTo( longHandLength, 0 );
      context.lineTo( 0, 0 );
      context.restore();

      // Short hand rotation
      context.save();
      context.rotate( rotationOffset + step * ( rotationSpeed/12 ) );

      // Draw from the center to the tip of the short hand
      context.lineTo( shortHandLength, 0 );
      context.stroke();

      context.restore();
      context.restore();

    }
  }

  requestAnimationFrame( boom );

}