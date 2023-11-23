import { AnimatedSprite, Sprite } from "pixi.js"
import { sprites } from "./loader"
import constants from "./constants"
import { EventHub, events } from './events'
import { removeSprite, tickerAdd, tickerRemove } from "./application"

const mixinBall = {
    screenResize(screenData) {
        this.screenScaleRate = screenData.scaleRate
        this.updateSize()
        this.position.x = screenData.offsetX + this.pointX * screenData.scaleRate
        this.position.y = screenData.offsetY + this.pointY * screenData.scaleRate
    },

    updateSize() {
        this.width = this.height = this.screenScaleRate * constants.ballSpriteSize * this.scaleRate * this.scaleRate
    },

    hide( callback = null ) {
        this.callback = callback
        this.isInner = false
        tickerAdd(this)
    },

    tick(delta) {
        if (this.isInner) {
            this.scaleRate += delta / constants.ballSpriteSizeRate
            if (this.target) {
                
            }
            if (this.scaleRate >= this.scaleMax) {
                this.scaleRate = this.scaleMax
                tickerRemove(this)
                if (this.callback) this.callback()
            }
        } else {
            this.scaleRate -= delta / constants.ballSpriteSizeRate
            if (this.scaleRate <= 0) {
                tickerRemove( this )
                EventHub.off( events.screenResize, this.screenResize.bind(this) )
                if (this.callback) this.callback()
                return removeSprite( this )
            }
        }
        this.updateSize()
    }
}

class ColorBall extends AnimatedSprite {
    constructor(color, x, y, screenData, scaleMax, callback) {
        super(sprites.balls.animations.color)
        this.color = color
        this.target = null
        this.callback = callback
        this.screenScaleRate = screenData.scaleRate
        this.isInner = true
        this.loop = true
        this.animationSpeed = 0.3
        this.updateAnchor = true
        this.pointX = x
        this.pointY = y
        this.scaleRate = 0
        this.scaleMax = scaleMax
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
        this.play()
        tickerAdd(this)
    }
}
Object.assign(ColorBall.prototype, mixinBall)


class Ball extends Sprite {
    constructor(spriteName, color, x, y, screenData, scaleMax, callback) {
        super(sprites.balls.textures[spriteName])
        this.color = color
        this.target = null
        this.callback = callback
        this.isInner = true
        this.anchor.set(0.5)
        this.pointX = x
        this.pointY = y
        this.scaleRate = 0
        this.scaleMax = scaleMax
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
        tickerAdd(this)
    }
}
Object.assign(Ball.prototype, mixinBall)

export default function getBall( color, x, y, screenData, scaleMax = 1, callback = null ) {
    switch(color) {
        case constants.ballKeys.color : return new ColorBall(color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.red : return new Ball("ball_0", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.yellow : return new Ball("ball_70", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.green : return new Ball("ball_60", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.blue : return new Ball("ball_30", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.purple : return new Ball("ball_20", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.brown : return new Ball("ball_80", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.aqua : return new Ball("ball_40", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.stone : return new Ball("ball_50", color, x, y, screenData, scaleMax, callback)
        case constants.ballKeys.pink : return new Ball("ball_10", color, x, y, screenData, scaleMax, callback)
    }
}