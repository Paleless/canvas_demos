//(obj, obj) 
//将fnObj的属性复制给obj
function mountProtos(fnObj, obj) {
    Object.keys(fnObj).forEach(key => {
        obj[key] = fnObj[key]
    })
}

const utils = {
    //角度转弧度
    deg(o) {
        return Math.PI * o / 180
    },

    //弧度转角度
    rDeg(deg) {
        return deg * 180 / Math.PI
    },

    //随机数
    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },

    //两点距离
    distance([x1, y1], [x2, y2]) {
        const disX = x1 - x2
        const disY = y1 - y2
        return Math.sqrt(Math.pow(disX, 2), Math.pow(disY, 2))
    }
}


/*
option:{
    canvas: this html canvas element, can be css sleector or html element
    env: width and height are required to initalize the canvas
    loop: function to loop
}
 */
class Game {
    constructor(option) {
        //toCheck the option params
        ["loop", "env"].forEach(item => {
            if (!option[item]) {
                throw Error(`not hava ${item}`)
            }
        })
        this.canvas = document.querySelector(option.canvas) || document.querySelector('canvas') || option.canvas
        this.env = option.env
        this.loopFn = option.loop
        this.beforeLoop = option.beforeLoop || console.log
        this.init()
    }
    init() {
        this.canvas.width = this.env.width
        this.canvas.height = this.env.height
        this.ctx = this.canvas.getContext('2d')
        this.loopFn = this.loopFn.bind(this)
        this.beforeLoop()
        this.loop()
    }

    loop() {
        this.loopFn()
        requestAnimationFrame(this.loop.bind(this))
    }
}

mountProtos(utils, Game)
export default Game