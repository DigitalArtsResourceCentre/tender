
button.addEventListener("click", () => {
  let children = document.getElementById("area");
  if (area.childElementCount > 5) {
    console.log("more than five");
  }

  // if there are too many divs
  // print a message to the screen

  area.insertAdjacentHTML("afterBegin", `<div class="thing">stuff</div>`);
});

area.addEventListener("click", (e) => {
  if (e.target.className != "thing") return;

  e.target.remove();
});
