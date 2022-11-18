button.addEventListener("click", () => {
    area.insertAdjacentHTML("afterBegin", `<div class="thing">Thing</div>`);
  });
  
  area.addEventListener("click", (e) => {
    if (e.target.className != "thing") return;
  
    e.target.remove();
  });
  