fetch("instinct.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json()
  })
  .then(data => {
    const species = new Set(data.map(entry => entry.name));

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 30;
    const maxSize = 30;

    const contentContainer = document.querySelector('.contentContainer')


    let mousePos = vec2.fromValues(innerWidth * 0.25, innerHeight * 0.5);
    let numThingsX;
    let numThingsY;
    let things;

    let currentWord = null

    function addWord() {
      if (species.size == 0) {
        return
      }

      if (currentWord) {
        currentWord.remove();
      }

      currentWord = document.createElement('p');

      const items = [...species];
      const specie = items[Math.floor(Math.random() * items.length)];

      currentWord.innerText = specie;

      species.delete(specie)

      currentWord.classList.add('word')
      contentContainer.appendChild(currentWord);

      currentWord.style.position = 'absolute';
      const left = (Math.random() * 90) + 5;
      const top = (Math.random() * 90) + 5;
      currentWord.style.left = `${left}%`
      currentWord.style.top = `${top}%`

      const xShift = left > 90;
      const yShift = top > 90;
      currentWord.style.transform = `translate(${xShift ? '-100%' : '0'}, ${yShift ? '-100%' : '0'})`

      return currentWord;
    }

    function drawThing(thing) {
      const { pos, radius } = thing;
      ctx.fillStyle = '#420970';
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      things.forEach(thing => {
        const dist = vec2.dist(mousePos, thing.pos);
        thing.radius = clamp(dist * dist * 0.0003 - 1, 0, maxSize);
        drawThing(thing);
      });

      const radius = maxSize * 12;

      if (currentWord) {
        const { x, y, width, height } = currentWord.getBoundingClientRect();

        const center = { x: x + width / 2, y: y + height / 2 }

        const dist = vec2.dist(mousePos, vec2.fromValues(center.x, center.y));

        const alreadyIntersecting = currentWord.hasAttribute('intersects')

        if (dist < radius) {
          if (!alreadyIntersecting) {
            currentWord.classList.add('fade-out');
            currentWord.setAttribute('intersects', true)

            const fadeOutDelay = parseFloat(getComputedStyle(currentWord).getPropertyValue('--fadeOutDelay'));
            const fadeOutDuration = parseFloat(getComputedStyle(currentWord).getPropertyValue('--fadeOutDuration'));

            setTimeout(() => {
              if (currentWord.classList.contains('fade-out')) {
                addWord();
              }
            }, (fadeOutDelay + fadeOutDuration) * 1000)
          }
        } else if (alreadyIntersecting) {
          currentWord.removeAttribute('intersects')
          currentWord.classList.remove('fade-out');
        }

      }

      // For now I'm turning off the RAF loop because
      // there are no ongoing animations.
      // window.requestAnimationFrame(loop);
    }

    function makeThing(x, y) {
      return {
        pos: vec2.fromValues(x, y),
        radius: 2,
      };
    }

    function makeThings() {
      things = [];
      for (let i = 0; i < numThingsY; i += 1) {
        for (let j = 0; j < numThingsX; j += 1) {
          const thing = makeThing(j * cellSize + cellSize * 0.5, i * cellSize + cellSize * 0.5);
          things.push(thing);
        }
      }
    }

    function sizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const canvasRect = canvas.getBoundingClientRect();
      canvas.width = canvasRect.width * dpr;
      canvas.height = canvasRect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    function handleResize() {
      sizeCanvas();
      numThingsX = Math.ceil(innerWidth / cellSize);
      numThingsY = Math.ceil(innerHeight / cellSize);
      makeThings();
    }
    window.addEventListener('resize', throttled(handleResize));

    function handleMouseMove(event) {
      vec2.set(mousePos, event.clientX, event.clientY);
      loop();
    }
    window.addEventListener('mousemove', throttled(handleMouseMove));

    // Kick it off
    handleResize();
    addWord();
    loop();

    // USEFUL FUNCTIONS ----------
    function throttled(fn) {
      let didRequest = false;
      return param => {
        if (!didRequest) {
          window.requestAnimationFrame(() => {
            fn(param);
            didRequest = false;
          });
          didRequest = true;
        }
      };
    }
    function clamp(value, min = 0, max = 1) {
      return value <= min ? min : value >= max ? max : value;
    }

    // new stuff


    // let me = document.getElementById("me");
    // console.log(me);

    function over() {
      this.timeout = window.setTimeout(function () {
        console.log('here')
      }, 100)
    }

    function left() {
      if (this.timeout) window.clearTimeout(this.timeout)
    }

  })
  .catch(error => {
    // ...show/handle error...
  });

