function Init() {
  let w = wrap.clientWidth;
  let h = wrap.clientHeight;
  ellipse.setAttributeNS(null, "viewBox", `0 0 ${w}  ${h}`);
  let d = `M${w / 10},${h / 2}A${4 * w / 10},${4 * h / 10} 0 0 0 ${9 *
    w /
    10} ${5 * h / 10} A${4 * w / 10},${4 * h / 10} 0 0 0 ${w / 10} ${5 *
    h /
    10} A${4 * w / 10},${4 * h / 10} 0 0 0 ${9 * w / 10} ${5 * h / 10} A${4 *
    w /
    10},${4 * h / 10} 0 0 0 ${w / 10} ${5 * h / 10}`;

  thePath.setAttributeNS(null, "d", d);
  let path_length =  thePath.getTotalLength();
  
  
  //begin at a bigger size than needed
  let font_size = 100;
  ellipse.style.fontSize = font_size+"px"; 
  
  // while the text length is bigger than half path length 
  while(tp.getComputedTextLength() > path_length / 2 ){
    //reduce the font size
    font_size -=.25;
    //reset the font size 
    ellipse.style.fontSize = font_size+"px";
  }
}



window.setTimeout(function() {
  Init();
  window.addEventListener("resize", Init, false);
}, 15);

let so = 0;

function Marquee() {
  requestAnimationFrame(Marquee);
  tp.setAttributeNS(null, "startOffset", so + "%");
  if (so >= 50) {
    so = 0;
  }
  so += 0.02;
}

Marquee();