const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    hue: 0,
    particles: [],
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
    bg: null
}

function random(min, max) {
    return Math.floor(min + Math.random() * (max - min))
}

function distance(x1, y1, x2, y2) {
    const disX = x1 - x2
    const disY = y1 - y2
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
}

function deg(o) {
    return Math.PI * o / 180
}

class Particle {
    constructor({ x, y }) {
        this.cx = env.cx
        this.cy = env.cy
        if (x && y) {
            this.angle = Math.atan2(y - this.cy, x - this.cx) * 180 / Math.PI
            this.r = distance(x, y, this.cx, this.cy)
            this.x = x
            this.y = y
        } else {
            this.angle = random(0, 360)
            this.r = random(3, env.width / 2)
            this.x = this.cx + Math.cos(deg(this.angle)) * this.r
            this.y = this.cy + Math.sin(deg(this.angle)) * this.r
        }
        this.v = random(.5, 1.2)
        this.coords = new Array(5).fill([this.x, this.y])

    }

    update() {
        this.angle += this.v
        this.x = this.cx + Math.cos(deg(this.angle)) * this.r
        this.y = this.cy + Math.sin(deg(this.angle)) * this.r
        this.coords.pop()
        this.coords.unshift([this.x, this.y])
    }

    draw() {
        const lastPoint = this.coords[this.coords.length - 1]
        ctx.beginPath();
        ctx.moveTo(lastPoint[0], lastPoint[1]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        this.update()
    }
}


(function init() {
    canvas.width = env.width
    canvas.height = env.height
    env.bg = ctx.createRadialGradient(env.width / 2, env.height / 2, 0, env.width / 2, env.height / 2, env.width / 2);
    env.bg.addColorStop(0, "red");
    env.bg.addColorStop(1, "blue");
    for (let i = 0; i < 5; i++) {
        env.particles.push(new Particle({}))
    }

    function bind() {
        document.addEventListener('mousedown', function(e) {
            function fn(e) {
                env.particles.push(new Particle({ x: e.pageX, y: e.pageY }))
            }
            document.addEventListener('mousemove', fn)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', fn)
            })
        })
    }

    function animate(argument) {
        ctx.fillStyle = "rgba(0,0,0, .15)";
        ctx.strokeStyle = env.bg;
        ctx.fillRect(0, 0, env.width, env.height);
        env.hue += .5
        env.particles.forEach(particle => particle.draw())
        requestAnimationFrame(animate)
    }
    bind()
    animate()
}())