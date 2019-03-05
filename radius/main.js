const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 120,
    lines: [],
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function deg(o) {
    return Math.PI * o / 180
}

function distance(x1, y1, x2, y2) {
    const disX = x1 - x2
    const disY = y1 - y2
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
}

class Line {
    constructor() {
        this.angle = random(0, 360)
        this.radius = random(1, 10)
        this.v = random(1, 10)
        this.r = random(10, env.width/2)
        this.x = Math.cos(deg(this.angle)) * this.r
        this.y = Math.sin(deg(this.angle)) * this.r
        this.coords = new Array(3).fill([this.x, this.y])
    }

    update() {
        //10 is to fix the range
        if (distance(this.x, this.y, env.cx, env.cy) > (this.r + 10)) {
            const angle = Math.atan2(env.cy - this.y, env.cx - this.x)
            this.x += this.v * Math.cos(angle)
            this.y += this.v * Math.sin(angle)
        } else {
            this.angle += this.v
            this.x = Math.cos(deg(this.angle)) * this.r + env.cx
            this.y = Math.sin(deg(this.angle)) * this.r + env.cy
        }
        this.coords.unshift([this.x, this.y])
        this.coords.pop()
    }

    draw() {
        ctx.strokeStyle = "red";
        ctx.lineCap = "round";
        ctx.lineWidth = this.radius;
        ctx.beginPath();
        const end = this.coords.length - 1
        ctx.moveTo(this.coords[end][0], this.coords[end][1]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        this.update()
    }
}

function init() {
    canvas.width = env.width
    canvas.height = env.height
    for (let i = 0; i < 100; i++) {
        env.lines.push(new Line({
            cx: env.width / 2,
            cy: env.height / 2
        }))
    }

    function bind() {
        document.addEventListener('mousedown', function(e) {
            env.cx = e.pageX
            env.cy = e.pageY
        })
    }

    function animate() {
        env.hue += .5
        ctx.fillStyle = "rgba(0,0,0,.2"
        ctx.fillRect(0, 0, env.width, env.height)
        env.lines.forEach(line => line.draw())
        requestAnimationFrame(animate)
    }
    bind()
    animate()
}

init()