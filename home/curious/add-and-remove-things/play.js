myButt = document.querySelector('#button')

button.addEventListener("click", () => {
  let children = document.getElementById("area");
  if (area.childElementCount < 55) {
    area.insertAdjacentHTML("afterBegin", `<div class="thing">STUFF</div>`);
  } else {
    console.log("you got all the stuff!");
    myButt.textContent = 'NO MORE STUFF';
    myButt.classList.remove("learn-more");
  }
});

area.addEventListener("click", (e) => {
  if (e.target.className != "thing") return;
  e.target.remove();
  myButt.textContent = 'get stuff';
  myButt.classList.add("learn-more");
});

   // buttonBox.removeChild(button);
    // const newbutton = document.createElement("button"); 
    // newbutton.setAttribute('content', 'get stuff');
    // newbutton.setAttribute('class', 'learn-more');  
    // newbutton.setAttribute('id', 'button');  
    // newbutton.textContent = 'get more';
    // buttonBox.appendChild(newbutton);