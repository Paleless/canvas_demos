const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 120,
    g: 1,
    f: 0.98
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const points = []
let targetPoint;

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function distance(x1, y1, x2, y2) {
    const disX = x1 - x2
    const disY = y1 - y2
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
}

function deg(o) {
    return Math.PI * o / 180
}

class Target {
    constructor({
        x,
        y
    }) {
        this.x = x
        this.y = y
        this.targetRadius = 1
        this.incLock = false
    }
    update() {
        if (this.targetRadius > 8) {
            this.incLock = true
        } else if (this.targetRadius < 1) {
            this.incLock = false
        }

        if (this.incLock) {
            this.targetRadius -= .1
        } else {
            this.targetRadius += .1
        }
    }
    draw() {
        ctx.strokeStyle = `hsl(${env.hue},100%,60%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.targetRadius, 0, deg(360))
        ctx.stroke()
        this.update()
    }
}

class Point {
    constructor({ x: tx, y: ty }) {
        this.sx = random(0, env.width)
        this.sy = random(0, env.height)
        this.x = this.sx
        this.y = this.sy
        this.tx = tx
        this.ty = ty
        this.angle = Math.atan2(ty - this.sy, tx - this.sx)
        this.dis = distance(this.sx, this.sy, tx, ty)
        this.disTra = 0
        this.a = .1
        this.v = 0
        this.coords = new Array(2).fill([this.x, this.y])
    }
    update() {
        if (this.disTra > this.dis) {
            this.v -= this.a
        } else {
            this.v += this.a
        }
        this.x += Math.cos(this.angle) * this.v
        this.y += Math.sin(this.angle) * this.v
        this.coords.pop()
        this.coords.unshift([this.x, this.y])
        this.disTra = distance(this.sx, this.sy, this.x, this.y)
    }
    draw() {
        ctx.strokeStyle = `hsl(${env.hue},100%,60%)`
        ctx.beginPath();
        const end = this.coords.length - 1
        ctx.moveTo(this.coords[end][0], this.coords[end][1])
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
        this.update()
    }
}

function draw() {
    env.hue += .5
    if (env.hue > 360) {
        env.hue = 10
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, env.width, env.height);
    ctx.globalCompositeOperation = "lighter";
    points.forEach(point => {
        point.draw()
    })
    targetPoint.draw()
    requestAnimationFrame(draw)
}

function init() {
    canvas.width = env.width
    canvas.height = env.height
    targetPoint = new Target({
        x: env.width / 2,
        y: env.height / 2
    })
    for (let i = 0; i < 800; i++) {
        points.push(new Point(targetPoint))
    }
    draw()
}

init()