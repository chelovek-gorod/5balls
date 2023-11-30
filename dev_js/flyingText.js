import { Text } from 'pixi.js'
import { textStyles } from './fonts'
import { tickerAdd, tickerRemove, removeSprite } from './application'
import { tick } from './functions'

const moveTime = 2400
const scaleRate = 0.5 / ((moveTime / 2) / tick)
const startTime = moveTime / 4
const halfBoardSize = 740
const halfPath = halfBoardSize / 2
const speed = halfBoardSize / (moveTime / tick)
const alphaAdd = 1 / (startTime / tick)
const alphaSub = alphaAdd * 2

class FlyingText extends Text {
    constructor(text) {
        super(text, textStyles.fly)
        this.anchor.set(0.5)
        this.scale.x = 0.5
        this.scale.y = 0.5
        this.alpha = 0
        this.position.x = halfBoardSize
        this.position.y = halfBoardSize
        tickerAdd(this)
    }

    tick( delta ) {
        this.position.y -= speed * delta
        this.scale.x = this.scale.y = this.scale.x += scaleRate * delta
        if (this.position.y > halfPath) this.alpha += alphaAdd * delta
        else {
            this.alpha -= alphaSub * delta
            if (this.alpha < 0) {
                tickerRemove(this)
                removeSprite(this)
            }
        }
    }
}

export default FlyingText