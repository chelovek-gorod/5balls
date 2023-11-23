import { TilingSprite } from "pixi.js"
import { getAppScreen } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

class Background extends TilingSprite {
    constructor( screenData ) {
        super( sprites.bg )
        this.uvRespectAnchor = true
        this.anchor.set(0.5)
        this.screenResize( getAppScreen() )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
    }

    screenResize(screenData) {
        this.width = screenData.width
        this.height = screenData.height
        this.position.x = screenData.centerX
        this.position.y = screenData.centerY
    }
}

export default Background