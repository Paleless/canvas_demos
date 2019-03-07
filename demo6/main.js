import Game from '../utils/game.js'
class Point {
    constructor({ ctx, x, range }) {
        this.ctx = ctx
        this.x = x
        this.y = Game.random(100, 200)
        this.range = range
    }
    update() {
        this.y += Game.random(-10, 10)
        if (this.y > this.range.max) {
            this.y = this.range.max
        } else if (this.y < this.range.min) {
            this.y = this.range.min
        }
    }
}

// (int, int) -> [x]
function splitSpace(len, width) {
    const spacing = width / len
    const xArray = []
    for (let i = 0; i < len; i++) {
        xArray.push(spacing * i)
    }
    xArray.push(width)
    return xArray
}

// ([Point], ctx) -> effect!
function renderWave(points, ctx) {
    points.forEach(point => {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Game.deg(360))
        ctx.fill();
    })
    ctx.beginPath()
    ctx.strokeStyle = "red";
    ctx.moveTo(points[0].x, points[0].y);
    points.reduce((prevPoint, nextPoint) => {
        const cx = (prevPoint.x + nextPoint.x) / 2
        const cy = (prevPoint.y + nextPoint.y) / 2
        ctx.quadraticCurveTo(cx, cy, nextPoint.x, nextPoint.y);
        return nextPoint
    })
    ctx.stroke();
}


new Game({
    env: {
        width: window.innerWidth,
        height: window.innerHeight,
        pointLen: 7,
        points: [],
        range: {
            max: 200,
            min: 100
        }
    },
    beforeLoop() {
        this.env.points = splitSpace(this.env.pointLen, this.env.width)
            .map(x => new Point({ x, ctx: this.ctx, range: this.env.range }))
    },
    loop() {
        this.ctx.clearRect(0, 0, this.env.width, this.env.height)
        // this.env.points.forEach(point => point.update())
        renderWave(this.env.points, this.ctx)
    }
})