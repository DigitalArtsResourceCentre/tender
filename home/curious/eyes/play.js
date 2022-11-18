const DEBUG = false

const baseObject = document.getElementById("base-eye");
const grid = document.getElementById("grid");
let eyes, eyeCenters;
let eyeDensity = 5;
let numEyesX, numEyesY;
const center = new THREE.Vector2();
const mousePos = new THREE.Vector2();
const PI = Math.PI;
let maxDist;
let prevDistances = [];
let canShake = []
let neverOpened = []
let waitingForComeback = []
const maxEyeTravelX = 275;
const maxEyeTravelY = 100;



let comebacks = []
function pushComeback(i) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.left = `${eyeCenters[i].x}px`;
  div.style.top = `${eyeCenters[i].y}px`;
  div.style.width = "5px"
  div.style.height = "5px"
  div.style.background = "red"

  div.style.display = "none"
  document.body.appendChild(div)

  comebacks.push(div);
}

init();

function init() {
  window.addEventListener("resize", throttled(handleResize));
  window.addEventListener("mousemove", throttled(handleMouseMove));
  handleResize();
  console.log("init");
}

function handleMouseMove(event) {
  mousePos.set(event.clientX, event.clientY);
  eyes.forEach(
    (eye, i) => {

      if (DEBUG) {
        comebacks[i].style.display = waitingForComeback[i] ? "block" : 'none'
      }

      const vecToMouse = new THREE.Vector2().subVectors(mousePos, eyeCenters[i]);
      const angle = vecToMouse.angle();
      const dist = mousePos.distanceTo(eyeCenters[i]);
      const distPercent = map(dist, 0, maxDist, 0, 1);
      const clampedMouseX = clamp(vecToMouse.x, maxEyeTravelX * -1, maxEyeTravelX);
      const clampedMouseY = clamp(vecToMouse.y, maxEyeTravelY * -1, maxEyeTravelY);
      const pupilX = map(clampedMouseX, 0, maxEyeTravelX, 0, maxEyeTravelX);
      const pupilY = map(clampedMouseY, 0, maxEyeTravelY, 0, maxEyeTravelY);
      const scale = map(dist, 0, maxDist, 0.5, 1.25);

      eye.style.setProperty("--pupil-x", pupilX);
      eye.style.setProperty("--pupil-y", pupilY);
      eye.style.setProperty("--scale", scale);

      const animating = eye.classList.contains('animating');
      const isOpen = eye.classList.contains('open')

      if (waitingForComeback[i] && prevDistances[i] && prevDistances[i] < maxDist / 12 && dist > maxDist / 12) {
        waitingForComeback[i] = false;
      }

      if (!animating && !waitingForComeback[i] && dist < maxDist / 5) {
        const intensity = map(distPercent, 0.2, 0, 0, 1);
        eye.querySelector('.glint').setAttribute('r', intensity * 100)
        eye.style.setProperty("--shaking-intensity", intensity);
        eye.classList.add('shake');
      } else {
        eye.style.setProperty("--shaking-intensity", 0);
        eye.classList.remove('shake');
      }


      if (animating) {
        prevDistances[i] = dist;
        return
      }

      if (dist < (isOpen ? 30 : 70)) {
        if ((neverOpened[i] || !waitingForComeback[i]) && !isOpen) {
          eye.classList.remove('close')
          eye.classList.add('open')
          eye.classList.add('animating')
          waitingForComeback[i] = true;

          const openCloseTime = getComputedStyle(eye)
            .getPropertyValue('--openTime');

          setTimeout(() => {
            eye.classList.remove('animating')
            neverOpened[i] = false;
          }, parseFloat(openCloseTime.replace("s", "")) * 1000)
        } else if (!waitingForComeback[i] && isOpen) {
          const openCloseTime = getComputedStyle(eye)
            .getPropertyValue('--closeTime');

          eye.classList.remove('open')
          eye.classList.add('close')
          canShake[i] = false;

          eye.classList.add('animating')

          setTimeout(() => {
            eye.classList.remove('animating')
            waitingForComeback[i] = true;
            eye.querySelector('.glint').setAttribute('r', 20)
          }, parseFloat(openCloseTime.replace("s", "")) * 1000)
        }
      }

      prevDistances[i] = dist
    });
}

function handleResize() {

  // recreate the grid and elements 
  const largeSide = Math.max(innerWidth, innerHeight);
  const size = Math.round(largeSide / eyeDensity);
  numEyesX = Math.ceil(innerWidth / size);
  numEyesY = Math.ceil(innerHeight / size);
  grid.style.setProperty("--num-columns", numEyesX);
  grid.style.setProperty("--num-rows", numEyesY);
  grid.innerHTML = "";
  generateArrowGrid();

  center.set(innerWidth * 0.5, innerHeight * 0.5);
  maxDist = center.length() * 2;

  // send a fake mouse event to trigger the initial point
  // handleMouseMove({ clientX: center.x, clientY: center.y });
}

function generateArrowGrid() {
  eyes = [];
  eyeCenters = [];
  for (let i = 0; i < numEyesX * numEyesY; i += 1) {

    // add the eye to the grid
    const newArrow = baseObject.cloneNode(true);
    newArrow.id = `eye-${i}`;
    newArrow.setAttribute("class", "eye");
    grid.appendChild(newArrow);
    eyes.push(newArrow);
    canShake.push(false)
    neverOpened.push(true)
    waitingForComeback.push(true);

    // save its center point for use later
    const eyeRect = newArrow.getBoundingClientRect();
    const eyeCenter = new THREE.Vector2(
      eyeRect.x + eyeRect.width / 2,
      eyeRect.y + eyeRect.height / 2
    );
    eyeCenters.push(eyeCenter);

    if (DEBUG) {
      pushComeback(i)
    }
  }
}

// USEFUL FUNCTIONS
function throttled(fn) {
  let didRequest = false;
  return param => {
    if (!didRequest) {
      requestAnimationFrame(() => {
        fn(param);
        didRequest = false;
      });
      didRequest = true;
    }
  };
}
function map(value, min1, max1, min2, max2) {
  return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
}
function clamp(value, min = 0, max = 1) {
  return value <= min ? min : value >= max ? max : value;
}
