const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 120,
    balls: [],
    lines: []
}

function random(min, max) {
    return Math.floor(min + Math.random() * (max - min))
}

function deg(o) {
    return Math.PI * o / 180
}

function distance([x1, y1], [x2, y2]) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}


class Ball {
    constructor() {
        this.x = random(0, env.width)
        this.y = random(0, env.height)
        this.r = 3
        this.vx = random(5, 8)/10
        this.vy = random(5, 8)/10
        this.light = random(50, 80)
    }
    update() {
        this.x += this.vx
        this.y += this.vy
        if ((this.x - this.r) < 0 || (this.x + this.r) > env.width) {
            this.vx = -this.vx
        }
        if ((this.y - this.r) < 0 || (this.y + this.r) > env.height) {
            this.vy = -this.vy
        }
    }
    render() {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${env.hue}, 100%, ${this.light}%)`;
        ctx.arc(this.x, this.y, this.r, 0, deg(360))
        ctx.fill()
        this.update()
    }
}

class Line {
    constructor(ball1, ball2) {
        this.ball1 = ball1
        this.ball2 = ball2
    }
    render() {
        const { x: sx, y: sy } = this.ball1
        const { x: tx, y: ty } = this.ball2
        ctx.strokeStyle = `hsl(${env.hue}, 80%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
    }
}

function draw() {
    env.hue += .3
    ctx.clearRect(0, 0, env.width, env.height);
    //clear the lines and rewrite it to avoid repeate line
    env.lines = []
    env.balls.forEach((ball1, index) => {
        env.balls.slice(index).forEach(ball2 => {
            const dis = distance([ball1.x, ball1.y], [ball2.x, ball2.y])
            if (dis < 100) {
                env.lines.push(new Line(ball1, ball2))
            }
        })
    })
    env.balls.forEach(ball => ball.render())
    env.lines.forEach((line, index) => line.render())
    requestAnimationFrame(draw)
}

(function init(env) {
    canvas.height = env.height
    canvas.width = env.width
    for (let i = 0; i < 50; i++) {
        env.balls.push(new Ball())
    }
    draw()
}(env))
