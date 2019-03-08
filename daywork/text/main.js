//utils
function deg(o) {
    return Math.PI * o / 180
}

function rDeg(deg) {
    return deg * 180 / Math.PI
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function distance(x1, y1, x2, y2) {
    const disX = x1 - x2
    const disY = y1 - y2
    return Math.sqrt(Math.pow(disX, 2), Math.pow(disY, 2))
}


//game
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 120
}

function createText(text, env) {
    const textCanvas = document.createElement('canvas')
    const textCtx = textCanvas.getContext('2d')
    textCanvas.width = env.width
    textCanvas.height = env.height
    textCtx.fillStyle = "#fff";
    textCtx.font = '200px arrial'
    textCtx.fillText(text, 0, 300);
    const imageData = textCtx.getImageData(0, 0, env.width, env.height);
    return imageData
}


class Dot {
    constructor({ tx, ty }) {
        this.tx = tx
        this.ty = ty
        this.sx = random(0, env.width)
        this.sy = random(0, env.height)
        this.x = this.sx
        this.y = this.sy
        this.dis = distance(this.x, this.y, tx, ty)
        this.tra = 0
        this.angle = Math.atan2(ty - this.y, tx - this.x)
        this.v = 1
    }
    update() {
        this.x += Math.cos(this.angle) * this.v
        this.y += Math.sin(this.angle) * this.v
        this.tra = distance(this.sx, this.sy, this.x, this.y)
        if (this.tra > this.dis) {
            this.v = 0
        }
    }
    draw() {
        ctx.fillStyle = `hsl(${env.hue},100%,80%)`;
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, 3, 3);
        this.update()
    }
}

(function init(env) {
    canvas.width = env.width;
    canvas.height = env.height
    const { width: w, height: h, data: nodes } = createText("Hello World", env)
    const dots = []
    for (let y = 0; y < h; y += 10) {
        for (let x = 0; x < w; x += 10) {
            const index = (x + y * w) * 4 + 3
            const pixel = nodes[index];
            if (pixel === 255) {
                dots.push(new Dot({ tx: x, ty: y }))
            }
        }
    }

    function draw() {
        env.hue += 1.5
        ctx.fillStyle = "rgba(0,0,0,.2)"
        ctx.fillRect(0, 0, env.width, env.height)
        dots.forEach(dot => dot.draw())
        requestAnimationFrame(draw)
    }
    draw()
}(env))