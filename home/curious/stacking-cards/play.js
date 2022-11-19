// https://github.com/dariusk/corpora

  fetch("mushrooms.json")
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      // ...my code using `data` here...
      for (let index = 0; index < 853; index++) {
        const div = document.createElement("div");
        div.classList.add("card");
        div.style.top = index + "px";
        div.style.rotate = index + "deg";
        div.textContent = data[index].taxonName;
        document.getElementById("contentContainer").appendChild(div);
      }
  })
  .catch(error => {
      // ...show/handle error...
  });