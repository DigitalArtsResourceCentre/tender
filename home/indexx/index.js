const indexTypes = document.getElementsByClassName("indexType");
const indexItems = document.getElementsByClassName("indexItem");

const spheres = document.getElementsByClassName("spheres");
const landscapes = document.getElementsByClassName("landscapes");
const clusters = document.getElementsByClassName("clusters");
const layers = document.getElementsByClassName("layers");
const structures = document.getElementsByClassName("structures");
const passages = document.getElementsByClassName("passages");
const hyphae = document.getElementsByClassName("hyphae");
const resistance = document.getElementsByClassName("resistance");

function mouseOver(me) {
  me.classList.add("fullOpacity");
  let allMyCSSClasses = me.className.split(" ");
  for (let i = 0; i < allMyCSSClasses.length; i++) {
    if (
      allMyCSSClasses[i] != "indexItem" &&
      allMyCSSClasses[i] != "fullOpacity" && 
      allMyCSSClasses[i] != "btn"
    ) {
      document.getElementById(allMyCSSClasses[i]).classList.add("fullOpacity");
    }
  }
}

function mouseOut(me) {
  me.classList.remove("fullOpacity");
  let allMyCSSClasses = me.className.split(" ");
  for (let i = 0; i < allMyCSSClasses.length; i++) {
    if (
      allMyCSSClasses[i] != "indexItem" &&
      allMyCSSClasses[i] != "fullOpacity" &&
      allMyCSSClasses[i] != "btn"
    ) {
      document
        .getElementById(allMyCSSClasses[i])
        .classList.remove("fullOpacity");
    }
  }
}

function mouseOnIndexType(me) {
    me.classList.add("fullOpacity");
    let type = me.innerHTML;
    let h = document.getElementsByClassName(type);
    for (let i = 0; i < h.length; i++) {
        h[i].classList.add("fullOpacity");         
    }
  }
  
  function mouseOffIndexType(me) {
    me.classList.remove("fullOpacity");
    let type = me.innerHTML;
    let h = document.getElementsByClassName(type);
    for (let i = 0; i < h.length; i++) {
        h[i].classList.remove("fullOpacity");         
    }   
  }

function hoverCheck() {
  for (i = 0; i < indexItems.length; i++) {
    indexItems[i].addEventListener("mouseover", (e) => {
      mouseOver(e.target);
    });
    indexItems[i].addEventListener("mouseout", (e) => {
      mouseOut(e.target);
    });
  }

  for (i = 0; i < indexTypes.length; i++) {
    indexTypes[i].addEventListener("mouseover", (e) => {
      mouseOnIndexType(e.target);
    });
    indexTypes[i].addEventListener("mouseout", (e) => {
      mouseOffIndexType(e.target);
    });
  }
}
hoverCheck();
