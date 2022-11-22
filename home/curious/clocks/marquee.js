const thePath = document.getElementById('thePath')
const tp = document.getElementById('tp')
const ellipse = document.getElementById('ellipse')
const wrap = document.getElementById('wrap')

function Init() {
  let w = wrap.clientWidth;
  let h = wrap.clientHeight;
  ellipse.setAttribute("viewBox", `0 0 ${w}  ${h}`);
  let d = `M${w / 10},${h / 2}A${4 * w / 10},${4 * h / 10} 0 0 0 ${9 *
    w /
    10} ${5 * h / 10} A${4 * w / 10},${4 * h / 10} 0 0 0 ${w / 10} ${5 *
    h /
    10} A${4 * w / 10},${4 * h / 10} 0 0 0 ${9 * w / 10} ${5 * h / 10} A${4 *
    w /
    10},${4 * h / 10} 0 0 0 ${w / 10} ${5 * h / 10}`;

  thePath.setAttribute("d", d);
  let path_length = thePath.getTotalLength();


  //begin at a bigger size than needed
  let font_size = 100;
  ellipse.style.fontSize = font_size + "px";

  // while the text length is bigger than half path length 
  while (tp.getComputedTextLength() > path_length / 2) {
    //reduce the font size
    font_size -= .25;
    //reset the font size 
    ellipse.style.fontSize = font_size + "px";
  }
}

Init();
window.addEventListener("resize", Init, false);
