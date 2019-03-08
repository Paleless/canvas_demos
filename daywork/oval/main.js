const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const env = {
    width: window.innerWidth,
    height: window.innerHeight,
    particles: [],
    hue: 0
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function deg(o) {
    return o * Math.PI / 180
}

function distance() {
    // body...
}

class Particle {
    constructor() {
        this.cx = env.width / 2
        this.cy = env.height / 2
        this.rx = random(100, 300)
        this.ry = random(30, 100)
        this.angle = random(0, 360)
        this.x = Math.cos(deg(this.angle)) * this.rx + this.cx
        this.y = Math.sin(deg(this.angle)) * this.ry + this.cy
        this.v = random(1, 3)
        this.coords = new Array(5).fill([this.x, this.y])
    }
    update() {
        this.angle += 1
        this.x = Math.cos(deg(this.angle)) * this.rx + this.cx
        this.y = Math.sin(deg(this.angle)) * this.ry + this.cy
        this.coords.unshift([this.x, this.y])
        this.coords.pop()
    }
    draw() {
        const end = this.coords.length - 1
        ctx.strokeStyle = `hsl(${env.hue},100%, 70%)`;
        ctx.beginPath();
        ctx.moveTo(this.coords[end][0], this.coords[end][1]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        this.update()
    }
}

function init(argument) {
    for (let i = 0; i < 1000; i++) {
        env.particles.push(new Particle())
    }
    canvas.width = env.width
    canvas.height = env.height

    function draw() {
        env.hue += .5
        requestAnimationFrame(draw)
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, env.width, env.height);
        env.particles.forEach(particle => particle.draw())
    }
    draw()
}

init()