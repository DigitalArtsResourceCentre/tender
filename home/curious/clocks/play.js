const clocksContainer = document.getElementById('clocksContainer')


function stringToEl(string) {
  var parser = new DOMParser(),
    content = 'text/html',
    DOM = parser.parseFromString(string, content);

  return DOM.body.childNodes[0];
}



const clock = `<div class="clockContainer">
<svg class="clock" width="45.945709mm" height="45.945709mm" version="1.1" viewBox="0 0 45.945709 45.945709"
xmlns="http://www.w3.org/2000/svg">
<circle cx="22.972853" cy="22.972855" r="22.380854" stroke-width="0" fill="transparent" />
<circle cx="22.972853" cy="22.972855" r="22.380854" stroke-width="1.18400002" />
<g class="slowDown" style="--slowDownSpeed : 0.65s">
<path class="clockHand" style="--revolutionTime: 1" d="m8.04279 32.800247 14.93021-9.82754"
  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.46500015" />
  </g>
  <g class="slowDown" style="--slowDownSpeed : 8s">
<path class="clockHand" style="--revolutionTime: 15" d="m30.57962 14.940867-7.60662 8.03184"
  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.46500015" />
  </g>
</svg>
</div>`


const clockElem = document.importNode(stringToEl(clock), true);



let width;
let height;

let vmin;

let dpr;

let cellSize;
let cellSpacing;
let cellSizeWithSpacing;

let margin;

let cols;
let rows;

const clocks = []

function setDimensionVars() {
  width = window.innerWidth;
  height = window.innerHeight;

  vmin = Math.min(width, height) / 100;

  dpr = window.devicePixelRatio;

  if (dpr > 1) {
    width *= dpr;
    height *= dpr;
    vmin *= dpr;
  }

  cellSize = vmin * 18;
  cellSpacing = cellSize * 0.3;
  cellSizeWithSpacing = cellSize + cellSpacing;

  margin = vmin;

  cols = Math.floor((width - margin * 2) / cellSizeWithSpacing);
  rows = Math.floor((height - margin * 2) / cellSizeWithSpacing);

  clocksContainer.style.setProperty('--padding', `${margin}px`)

  clocks.forEach(clock => {
    clock.style.width = `${cellSize}px`;
    clock.style.height = `${cellSize}px`;

    clock.style['margin-left'] = `${cellSpacing / 2}px`;
    clock.style['margin-right'] = `${cellSpacing / 2}px`;
  })
}

setDimensionVars();

window.addEventListener('resize', () => {
  setDimensionVars();


  const newAmount = cols * rows;

  if (newAmount > clocks.length) {
    while (clocks.length < newAmount) {
      addClock();
    }
  } else if (newAmount < clocks.length) {
    while (newAmount < clocks.length) {
      clocks.pop().remove();
    }
  }

})

function addClock() {
  const clock = clockElem.cloneNode(true);
  clock.querySelector('.clock').style.setProperty('--timeOffset', `-${Math.random() * 10}s`)
  clocks.push(clock);

  clock.style.width = `${cellSize}px`;
  clock.style.height = `${cellSize}px`;

  clock.style['margin-left'] = `${cellSpacing / 2}px`;
  clock.style['margin-right'] = `${cellSpacing / 2}px`;
  clocksContainer.appendChild(clock)
}

for (let i = 0; i < cols * rows; i++) {
  addClock();
}


var colorIndex = 0;
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


clocksContainer.addEventListener('click', () => {
  colorIndex = (++colorIndex) % colors.length;
  document.body.style.background = colors[colorIndex][0];

  clocksContainer.style.setProperty('--clockStrokeColor', colors[colorIndex][1])
})


