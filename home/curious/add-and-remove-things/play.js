button.addEventListener("click", () => {
    area.insertAdjacentHTML("afterBegin", `<div class="thing">stuff</div>`);
  });
  
  area.addEventListener("click", (e) => {
    if (e.target.className != "thing") return;
  
    e.target.remove();
  });
  