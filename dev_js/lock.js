import { Sprite } from "pixi.js";
import { sprites } from "./loader"

const settings = {
    width: 116,
    height: 126,
    anchorX: 0.55,
    anchorY: 0.49,
}

class Lock extends Sprite {
    constructor(x, y) {
        super( sprites.lock )
        this.anchor.set(settings.anchorX, settings.anchorY)
        this.width = settings.width
        this.height = settings.height
        this.position.x = x
        this.position.y = y
    }
}

export default Lock