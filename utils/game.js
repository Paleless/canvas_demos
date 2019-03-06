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



class Game {
    constructor(option) {

    }
    init() {

    }
}

mountProtos(utils, Game)
export default Game