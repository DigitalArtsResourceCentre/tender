const container = document.getElementById('spiralContainer')

const spinnings = []
let letterState = [];

const fadeTreshold = Math.pow(50, 2);
const stopTreshold = Math.pow(1, 2);

let activeTimeout = null;

const speed = 0.1;

let angle = 2.0;
let scalar = 3.5;

let lasttyped = 0;

window.addEventListener('keydown', (e) => {
    if (spinnings.length && e.key == 'Backspace') {
        spinnings.pop().remove();
        letterState.pop();
        lasttyped -= 12;
    }
});


window.addEventListener('keypress', (e) => {
    const span = document.createElement('span');
    span.innerText = e.key;

    if (e.key === 'Enter') {
        return
    }

    span.style.position = 'absolute';
    span.style.top = '10px';
    span.style.left = `calc(40% + ${lasttyped}px)`
    lasttyped += 12;

    container.appendChild(span)

    spinnings.push(span)
    letterState.push({ rotation: 0, active: false })

    if (activeTimeout) {
        clearTimeout(activeTimeout)
    }

    activeTimeout = setTimeout(() => {
        const poses = []

        for (let i = 0; i < letterState.length; i++) {
            if (!letterState[i].active) {
                const spinning = spinnings[i];
                const { top, left } = spinning.getBoundingClientRect();
                poses[i] = { top, left }
            }
        }

        const toLaunch = []

        for (let i = 0; i < letterState.length; i++) {
            if (!letterState[i].active) {
                const spinning = spinnings[i];

                const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
                const toCenter = { x: center.x - poses[i].left, y: center.y - poses[i].top }

                const angle = Math.atan2(toCenter.y, toCenter.x);
                const degrees = 180 * angle / Math.PI;
                letterState[i].offset = degrees;



                const distance = Math.sqrt(Math.pow(toCenter.x, 2) + Math.pow(toCenter.y, 2));



                letterState[i].toCenter = { x: toCenter.x / distance, y: toCenter.y / distance };

                toLaunch.push(i)
            }
        }

        toLaunch.reverse().forEach((i, count) => setTimeout(() => {
            letterState[i].active = true
        }, 100 * count))

        lasttyped = 0;

    }, 2000)
})

let lastFrameTime = performance.now();

function loop() {

    const now = performance.now()

    const deltaTime = now - lastFrameTime

    spinnings.forEach((spinning, i) => {

        if (letterState[i].active) {

            spinning.style.transform = '';
            const { top, left } = spinning.getBoundingClientRect();

            const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }


            spinning.style['transform-origin'] = `${center.x - left}px ${center.y - top}px`
            spinning.style.transform = `rotateZ(${letterState[i].rotation}deg) translate(${letterState[i].rotation * letterState[i].toCenter.x}px, ${letterState[i].rotation * letterState[i].toCenter.y}px)`

            letterState[i].rotation += deltaTime * speed;

            const { x, y, width, height } = spinning.getBoundingClientRect();

            const pos = { x: x + width / 2, y: y + height / 2 };

            const distanceSquared = Math.pow(center.x - pos.x, 2) + Math.pow(center.y - pos.y, 2);


            if (distanceSquared < fadeTreshold) {
                spinning.addEventListener('animationend', (event) => {
                    spinning.remove();
                });

                spinning.classList.add('fade-out')
            }

            if (distanceSquared < stopTreshold) {
                letterState[i].active = false;
            }
        }
    })


    requestAnimationFrame(loop)
    lastFrameTime = now;
}

loop();
