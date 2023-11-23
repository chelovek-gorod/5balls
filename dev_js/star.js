import { Sprite } from 'pixi.js'
import { sprites } from "./loader"
import { tickerAdd, tickerRemove, removeSprite,  } from './application'

const settings = {
    stars: 5,
    size: 120,
    offset: 70,
    scaleRate: 120
}
settings.delay = settings.scaleRate / settings.stars

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
}

class Star extends Sprite {
    constructor(color, x, y, delay) {
        super( sprites.stars.textures[ getStarSprite(color) ] )
        this.delay = delay
        this.anchor.set(0.5)
        //this.color = color
        this.pointX = x
        this.pointY = y
        this.stateScale = 0
        this.scaleRate = settings.scaleRate
        this.width = this.height = settings.size * this.stateScale
        this.alpha = 1
        this.changePosition()
        tickerAdd( this )
        this.isToDelete = false
    }

    changePosition() {
        const halfOffset = settings.offset / 2
        this.position.x = this.pointX - halfOffset + settings.offset * Math.random()
        this.position.y = this.pointY - halfOffset + settings.offset * Math.random()
    }

    tick( delta ) {
        if (this.delay > 0) return this.delay -= delta
        
        this.stateScale += delta / this.scaleRate
        if (this.stateScale > 0.5) this.alpha = 2 - this.stateScale*2 /* 0.5 ... 1 */
        if (this.stateScale > 1) {
            if (this.isToDelete) {
                tickerRemove(this)
                return removeSprite(this)
            } else {
                this.stateScale = 0
                this.alpha = 1
                this.changePosition()
            }
        }
        this.width = this.height = settings.size * this.stateScale
    }

    disappear() {
        this.isToDelete = true
    }
}

export default function getStars(color, x, y) {
    const stars = []
    for (let i = 0; i < settings.stars; i++) {
        stars.push( new Star(color, x, y, settings.delay * i ) )
    }
    return stars
}