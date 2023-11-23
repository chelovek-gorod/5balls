import { Sprite } from 'pixi.js'
import { sprites } from "./loader"
import constants from "./constants"
import { EventHub, events } from './events'
import { tickerAdd } from './application'

function getStarSprite(color) {
    switch(color) {
        case 'red' : return "star_0"
        case 'yellow' : return "star_70"
        case 'green' : return "star_60"
        case 'blue' : return "star_30"
        case 'purple' : return "star_20"
        case 'brown' : return "star_80"
        case 'aqua' : return "star_40"
        case 'stone' : return "star_50"
        case 'pink' : return "star_10"
    }
    sprites.balls.textures[spriteName]
}

class Star extends Sprite {
    constructor(color, x, y, screenData, delay) {
        super( sprites.stars.textures[ getStarSprite(color) ] )
        this.delay = delay
        this.screenData = screenData
        this.anchor.set(0.5)
        this.color = color
        this.pointX = x
        this.pointY = y
        this.stateScale = 0
        this.scaleRate = constants.star.scaleRate
        this.alpha = 1
        this.changePosition()
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
        tickerAdd( this )
    }

    changePosition() {
        const offset = constants.ballSpriteSize / 2
        const halfOffset = offset / 2
        this.randomPointX = this.pointX - halfOffset + offset * Math.random()
        this.randomPointY = this.pointY - halfOffset + offset * Math.random()
    }

    screenResize(screenData) {
        this.screenData = screenData
        this.width = this.height = screenData.scaleRate * constants.star.size * this.stateScale
        this.position.x = screenData.offsetX + this.randomPointX * screenData.scaleRate
        this.position.y = screenData.offsetY + this.randomPointY * screenData.scaleRate
    }

    tick( delta ) {
        if (this.delay > 0) return this.delay -= delta
        
        this.stateScale += delta / this.scaleRate
        if (this.stateScale > 0.5) this.alpha = 2 - this.stateScale*2 /* 0.5 ... 1 */
        if (this.stateScale > 1) {
            this.stateScale = 0
            this.alpha = 1
            this.changePosition()
            this.position.x = this.screenData.offsetX + this.randomPointX * this.screenData.scaleRate
            this.position.y = this.screenData.offsetY + this.randomPointY * this.screenData.scaleRate
        }
        this.width = this.height = constants.star.size * this.stateScale * this.screenData.scaleRate
    }
}

export default function getStars(color, x, y, screenData) {
    const stars = []
    for (let i = 0; i < constants.star.stars; i++) {
        stars.push( new Star(color, x, y, screenData, constants.star.delay * i ) )
    }
    return stars
}