const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 120,
    circles: []
}

function resolveCollision(circle1, circle2) {
    function resolveV1(v1, v2, m1, m2) {
        return ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
    }

    function resolveV2(v1, v2, m1, m2) {
        return (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2)
    }

    function fixPostion(circle1, circle2) {
        const { x: x1, y: y1, r: r1 } = circle1
        const { x: x2, y: y2, r: r2 } = circle2
        const disX = Math.abs(x2 - x1)
        const disY = Math.abs(y2 - y1)
        const disL = r2 + r1
        const angle = Math.atan2(disY, disX)
        if (x1 < x2) {
            circle1.x = circle2.x - Math.cos(angle) * disL
        } else {
            circle2.x = circle1.x - Math.cos(angle) * disL
        }
        if (y1 < y2) {
            circle1.y = circle2.y - Math.sin(angle) * disL
        } else {
            circle2.y = circle1.y - Math.sin(angle) * disL
        }
    }
    const { m: m1, vx: vx1, vy: vy1 } = circle1
    const { m: m2, vx: vx2, vy: vy2 } = circle2
    circle1.vx = resolveV1(vx1, vx2, m1, m2)
    circle2.vx = resolveV2(vx1, vx2, m1, m2)
    circle1.vy = resolveV1(vy1, vy2, m1, m2)
    circle2.vy = resolveV2(vy1, vy2, m1, m2)
    fixPostion(circle1, circle2)
}

function predicateCollision(circle1, circle2) {
    const { x: x1, y: y1, r: r1 } = circle1
    const { x: x2, y: y2, r: r2 } = circle2
    const dis = distance(x1, y1, x2, y2)
    return dis <= (r1 + r2)
}

function random(min, max) {
    return Math.floor((max - min) * Math.random() + min)
}

function distance(x1, y1, x2, y2) {
    const disX = x1 - x2
    const disY = y1 - y2
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
}

function deg(o) {
    return Math.PI * o / 180
}

class Circle {
    constructor({ x, y }) {
        this.x = x
        this.y = y
        this.vx = random(1, 5)
        this.vy = random(1, 5)
        this.r = 10
        this.m = 1
    }
    update() {
        this.x += this.vx
        this.y += this.vy
        env.circles.forEach(circle => {
            if (this === circle) {
                return
            }
            if (predicateCollision(this, circle)) {
                resolveCollision(this, circle)
            }
        })
        if (this.x - this.r < 0 || this.x + this.r > env.width) {
            this.vx = -this.vx
            if (this.x < this.r) {
                this.x = this.r
            } else {
                this.x = env.width - this.r
            }
        }
        if (this.y - this.r < 0 || this.y + this.r > env.height) {
            this.vy = -this.vy

            if (this.y < this.r) {
                this.y = this.r
            } else {
                this.y = env.height - this.r
            }
        }
    }
    draw() {
        this.update()
        ctx.strokeStyle = `hsl(${env.hue},100%, 80%)`
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, deg(360))
        ctx.stroke();
    }
}


function init() {
    canvas.width = env.width
    canvas.height = env.height
    for (let i = 0; i < 100; i++) {
        let x = random(0, env.width)
        let y = random(0, env.width)
        env.circles.forEach(circle => {
            while (predicateCollision(circle, { x, y, r: 10 }) || x < 10 || y < 10 || x + 10 > env.width || y + 10 > env.height) {
                x = random(0, env.width)
                y = random(0, env.height)
            }
        })
        env.circles.push(new Circle({ x, y }))
    }

    function draw() {
        env.hue += .5
        ctx.clearRect(0, 0, env.width, env.height);
        env.circles.forEach(circle => circle.draw())
        requestAnimationFrame(draw)
    }
    draw()
}

init()