document.body.classList.add("preload");

window.addEventListener("load", showPage);

function showPage() {
  document.body.classList.remove("preload");
}

let isLocationSet = false;

// arrays

let rotate = "rotate";

let directions = ["top", "bottom", "left", "right"];
let horStartPos = [
  "horizontal0",
  "horizontal1",
  "horizontal2",
  "horizontal3",
  "horizontal4",
  "horizontal5",
  "horizontal6",
  "horizontal7",
  "horizontal8",
  "horizontal9",
  "horizontal10",
  "horizontal12",
  "horizontal12",
  "horizontal13",
  "horizontal14",
];
let vertStartPos = [
  "vertical0",
  "vertical1",
  "vertical2",
  "vertical3",
  "vertical4",
  "vertical5",
  "vertical6",
  "vertical7",
  "vertical8",
  "vertical9",
  "vertical10",
  "vertical11",
  "vertical12",
  "vertical13",
  "vertical14",
];

let rotStart = [
  "rotate1",
  "rotate2",
  "rotate3",
  "rotate4",
  "rotate5",
  "rotate6",
  "rotate7",
  "rotate8",
  "rotate9",
  "rotate10",
  "rotate11",
  "rotate12",
  "rotate13",
  "rotate14",
  "rotate15",
];

let animLeft = ["left1", "left2", "left3", "left4", "left5", "left6"];
let animRight = ["right1", "right2", "right3", "right4", "right5", "right6"];
let animDown = ["down1", "down2", "down3", "down4", "down5", "down6"];
let animUp = ["up1", "up2", "up3", "up4", "up5", "up6"];

let random80s = [40, 60, 70, 84, 85, 86, 87, 88, 100];
// let random80s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let random0s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let random0s = [1, 2, 3, .4, .5, 6, 7, 8, 9, 10];

function popRandom(array) {
  let i = (Math.random() * array.length) | 0;
  return array.splice(i, 1)[0];
}

const items = document.getElementsByClassName("item");
const images = document.getElementsByClassName("item_image");

// function rotateImage() {
//   for (i = 0; i < images.length; i++) {
//     let randomRotate = popRandom(rotStart);
//     items[i].classList.add(randomRotate);
//   }
// }

// rotateImage();

function setOriginalScreenLocationOfEachItem(i) {
  let randomHorStartPos = popRandom(horStartPos);
  let randomVertStartPos = popRandom(vertStartPos);
  i.classList.add(randomHorStartPos);
  i.classList.add(randomVertStartPos);
}


function checkIfIveSeenThisItemBefore(hi) {
  if (isLocationSet == false) {
    for (i = 0; i < items.length; i++) {
      setOriginalScreenLocationOfEachItem(items[i]);
      setAnimationForEachItem(items[i]);
      items[i].addEventListener("animationend", (e) => {
        checkIfIveSeenThisItemBefore(e.target);
      });
    }
    isLocationSet = true;
  } else {
    setAnimationForEachItem(hi);
  }
}

function setAnimationForEachItem(i) {
  // if it's not our first time here, reset the classlist
  // I might also want to add some more randomness to the position
  if (isLocationSet == true) {
    i.className = "";
    i.classList.add("item");
  }

  let randomDir = directions[Math.floor(Math.random() * directions.length)];
  i.classList.add(randomDir);

  let random80 = random80s[Math.floor(Math.random() * random80s.length)];
  let random0 = random0s[Math.floor(Math.random() * random0s.length)];

  if (randomDir == "top") {
    let randomDown = animDown[Math.floor(Math.random() * animDown.length)];
    let anim =
      "animation: " +
      random80 +
      "s linear " +
      random0 +
      "s 1 normal none running " +
      randomDown +
      ";";
    i.style = anim;
  } else if (randomDir == "bottom") {
    let randomUp = animUp[Math.floor(Math.random() * animUp.length)];
    let anim =
      "animation: " +
      random80 +
      "s linear " +
      random0 +
      "s 1 normal none running " +
      randomUp +
      ";";
    i.style = anim;
  } else if (randomDir == "left") {
    let randomRight = animRight[Math.floor(Math.random() * animRight.length)];
    let anim =
      "animation: " +
      random80 +
      "s linear " +
      random0 +
      "s 1 normal none running " +
      randomRight +
      ";";
    i.style = anim;
  } else {
    let randomLeft = animLeft[Math.floor(Math.random() * animLeft.length)];
    let anim =
      "animation: " +
      random80 +
      "s linear " +
      random0 +
      "s 1 normal none running " +
      randomLeft +
      ";";
    i.style = anim;
  }

  // while  ( !isInViewport (items[i]) ) {
  //     console.log("hj");
  // }
}

checkIfIveSeenThisItemBefore();
