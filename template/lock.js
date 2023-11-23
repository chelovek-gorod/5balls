import { Sprite } from "pixi.js";
import { sprites } from "./loader"
import constants from "./constants"
import { EventHub, events } from './events'

class Lock extends Sprite {
    constructor(x, y, screenData) {
        super( sprites.lock )
        this.anchor.set(0.54, 0.49)
        this.pointX = x
        this.pointY = y
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
    }

    screenResize(screenData) {
        this.width = screenData.scaleRate * constants.lockSprite.width
        this.height = screenData.scaleRate * constants.lockSprite.height
        this.position.x = screenData.offsetX + this.pointX * screenData.scaleRate
        this.position.y = screenData.offsetY + this.pointY * screenData.scaleRate
    }
}

export default Lock