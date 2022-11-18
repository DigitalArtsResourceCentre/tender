document.addEventListener('DOMContentLoaded', () => {
    const containerElement = document.getElementById('p5-container');
    const input = document.querySelector('#hidden-input');

    const startHeight = document.body.clientHeight;

    document.querySelector('#Keyboard__container').addEventListener('click', () => {
        if (document.body.clientHeight < startHeight) {
            input.blur();
        } else {
            input.focus();
        }
    })

    const startBlink = setTimeout(() => {
        document.querySelector('#Keyboard__container').classList.add('blink')
    }, 6500)


    let poses = []

    function fillPoses(str, offset = { x: 0, y: 0 }) {
        const svg = ASCII_PATHS[str.charCodeAt(0)]

        const parser = new DOMParser();

        const doc = parser.parseFromString(svg, "text/html");

        const path = doc.querySelector('path')

        const length = path.getTotalLength();

        const yOffset = parseFloat(doc.querySelector('svg').getAttribute('height'))

        const resolution = 5;


        for (let i = 0; i < Math.ceil(length / resolution); i++) {
            const { x, y } = path.getPointAtLength(i * resolution)

            poses.push({ x: x + offset.x, y: parseFloat(y) + yOffset + offset.y });
        }
    }


    /**
     * 
     * @param {typeof import('p5')} p 
     */
    const sketch = (p) => {
        const RADIUS = 10;
        const HOVERITENSITY = 0.1;
        const dotSpeed = 1;

        let str = ""

        let numberOfBRs = 0;
        let lineLength = 0;

        const dotPositions = new Array()
        const dotColors = []


        const colors = ['#FF640E', '#F43D60', '#C1458D', '#7B5398']

        const lineWidth = Math.round(containerElement.clientWidth / 42)

        const pushDotPosition = (elem) => {
            const color = p.color(colors[Math.floor(Math.random() * colors.length)])
            color.setAlpha(Math.random() * 255)
            dotColors.push(color);
            dotPositions.push(elem);
        }

        Object.defineProperty(dotPositions, 'last', {
            get: function () {
                return this.length ? this[this.length - 1] : undefined;
            }
        });

        p.setup = () => {
            p.createCanvas(containerElement.clientWidth, containerElement.clientHeight);
            p.background(220);

            for (let i = 0; i < 1000; i++) {
                pushDotPosition({ x: Math.random() * p.width, y: Math.random() * p.height })
            }


            containerElement.addEventListener('mobileKeyPressed', ({ detail: { key } }) => {
                onKey(key)
            })
        }

        p.windowResized = () => {
            p.resizeCanvas(containerElement.clientWidth, containerElement.clientHeight);
        }

        p.mousePressed = () => {
            pushDotPosition({ x: p.mouseX, y: p.mouseY });
        }

        p.mouseDragged = () => {
            pushDotPosition({ x: p.mouseX, y: p.mouseY });
        }

        p.draw = () => {
            p.background(255);

            for (let i = 0; dotPositions.length && i < dotPositions.length; i++) {
                if (i >= poses.length || dotPositions[i].done) {
                    const done = dotPositions[i].done;
                    dotPositions[i] = { x: dotPositions[i].x, y: dotPositions[i].y + Math.sin((p.frameCount + i) / 60) * HOVERITENSITY };

                    if (done) {
                        dotPositions[i].done = true;
                    }
                }
            }

            const max = Math.min(poses.length, dotPositions.length);
            for (let i = 0; i < max; i++) {
                if (dotPositions[i].done) {
                    continue
                }

                const toOrigin = p.createVector(poses[i].x, poses[i].y).sub(dotPositions[i].x, dotPositions[i].y);

                const move = dotSpeed * p.deltaTime;

                if (toOrigin.mag() < move) {
                    dotPositions[i] = { x: poses[i].x, y: poses[i].y, done: true }
                    continue;
                }

                const normal = toOrigin.normalize();

                dotPositions[i] = { x: dotPositions[i].x + normal.x * move, y: dotPositions[i].y + normal.y * move }
            }



            dotPositions.forEach(({ x, y }, i) => {
                p.fill(dotColors[i])
                p.noStroke();
                // p.stroke('#3F5481')
                p.circle(x, y, RADIUS);
            });
        }


        function newLine() {
            lineLength = 0;
            numberOfBRs++;
        }


        function onKey(key) {
            if (key != 'Enter') {
                str += key;

                if (lineLength % (lineWidth + 1) == lineWidth) {
                    newLine()
                }

                fillPoses(str[str.length - 1], { x: lineLength * 42, y: numberOfBRs * 60 });
                lineLength++;
            } else {
                newLine()
            }
        }


        p.keyTyped = () => {
            clearTimeout(startBlink);
            document.querySelector('#Keyboard__container').classList.remove('blink')

            onKey(p.key)
        }
    };

    new p5(sketch, containerElement);

}, false);

