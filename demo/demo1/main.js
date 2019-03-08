const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')
const ENV = {
    width: window.innerWidth,
    height: window.innerHeight,
    f: 0.95,
    g: 1,
    hue: 120
}
let particles = []
let fireWorks = []

function random(min, max) {
    return min + Math.random() * (max - min)
}

function dis(sx, sy, tx, ty) {
    const disX = tx - sx
    const disY = ty - sy
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
}

class Firework {
    constructor({
        sx,
        sy,
        tx,
        ty
    }) {
        this.x = sx
        this.y = sy
        this.sx = sx
        this.sy = sy
        this.tx = tx
        this.ty = ty
        this.a = 0.5
        this.speed = 1
        this.disBet = dis(sx, sy, tx, ty)
        this.disTrv = 0
        this.angle = Math.atan2(ty - sy, tx - sx)
        this.coordinates = new Array(3).fill([this.x, this.y])
        this.targetRadius = 1
        this.brightness = random(50, 70)
    }
    update(index) {
        this.speed += this.a
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.coordinates.unshift([this.x, this.y])
        this.coordinates.pop()
        this.disTrv = dis(this.sx, this.sy, this.x, this.y)
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3
        } else {
            this.targetRadius = 1
        }
        if (this.disTrv >= this.disBet) {
            fireWorks.splice(index, 1)
            createParticles(this.tx, this.ty)
        }
    }
    draw() {
        const end = this.coordinates.length - 1
        ctx.strokeStyle = `hsl(${ENV.hue},100%,${this.brightness}%)`
        ctx.beginPath()
        ctx.moveTo(this.coordinates[end][0], this.coordinates[end][1])
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

class Particle {
    constructor({
        x = 0,
        y = 0
    }) {
        this.x = x
        this.y = y
        this.coordinates = new Array(5).fill([this.x, this.y])
        this.speed = random(1, 10)
        this.angle = random(0, Math.PI * 2)
        this.alpha = 1
        this.decay = random(0.015, 0.03)
    }
    update(index) {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.coordinates.unshift([this.x, this.y])
        this.coordinates.pop()
        this.alpha -= this.decay
        if (this.alpha <= this.decay) {
            particles.splice(index, 1)
        }
    }
    draw() {
        ctx.beginPath();
        const end = this.coordinates.length - 1
        ctx.strokeStyle = `hsla(${ENV.hue},100%,50,${this.alpha})`;
        ctx.moveTo(this.coordinates[end][0], this.coordinates[end][1])
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
    }
}

function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle({ x, y }))
    }
}

function init() {
    canvas.width = ENV.width
    canvas.height = ENV.height
    draw()
}

function draw() {
    ENV.hue += 0.5
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, ENV.width, ENV.height);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((particle, index) => {
        particle.draw()
        particle.update(index)
    })
    fireWorks.forEach((fireWork, index) => {
        fireWork.draw()
        fireWork.update(index)
    })
    requestAnimationFrame(draw)
}

init()

document.addEventListener('mousedown', function(e) {
    function fn(e) {
        const { pageX: tx, pageY: ty } = e
        fireWorks.push(new Firework({
            sx: ENV.width / 2,
            sy: ENV.height / 2,
            tx,
            ty
        }))
    }
    document.addEventListener('mousemove', fn)
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', fn)
    })
})