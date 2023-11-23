import { Sprite, TilingSprite } from "pixi.js"
import { getAppScreen } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    flowerOffsetRate: 0.75,
    flowerMaxSideSize: 100,
}

class Background extends TilingSprite {
    constructor( screenData ) {
        super( sprites.bg )
        //this.uvRespectAnchor = true
        //this.anchor.set(0.5)

        this.flowers = this.addFlowers()

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
    }

    screenResize(screenData) {
        this.width = screenData.width
        this.height = screenData.height
        this.position.x = 0
        this.position.y = 0

        this.flowers[0].position.y = 0
        this.flowers[1].position.y = 0
        this.flowers[2].position.y = screenData.height
        this.flowers[3].position.y = screenData.height

        const offset = screenData.offsetX + screenData.offsetY
        const flowerMaxSize = offset * settings.flowerOffsetRate
        let flowerSizeRate = flowerMaxSize / settings.flowerMaxSideSize
        if (flowerSizeRate > 1) flowerSizeRate = 1
        

        if (screenData.offsetX) {
            // landscape orientation
            this.flowers[0].position.x = screenData.offsetX / 2
            this.flowers[0].anchor.set(1, 0)

            this.flowers[1].position.x = screenData.width - screenData.offsetX / 2
            this.flowers[1].anchor.set(0, 0)

            this.flowers[2].position.x = screenData.width - screenData.offsetX / 2
            this.flowers[2].anchor.set(0, 1)

            this.flowers[3].position.x = screenData.offsetX / 2
            this.flowers[3].anchor.set(1, 1)
        } else {
            // portrait orientation
            this.flowers[0].position.x = 0
            this.flowers[0].anchor.set(0, 0)

            this.flowers[1].position.x = screenData.width
            this.flowers[1].anchor.set(1, 0)

            this.flowers[2].position.x = screenData.width
            this.flowers[2].anchor.set(1, 1)

            this.flowers[3].position.x = 0
            this.flowers[3].anchor.set(0, 1)
        }
        this.flowers.forEach( flower => {
            flower.scale.x = flowerSizeRate
            flower.scale.y = flowerSizeRate
        })
    }

    addFlowers() {
        const flowers = []
        flowers.push(new Sprite( sprites.flowerTop1 ))
        flowers.push(new Sprite( sprites.flowerTop2 ))
        flowers.push(new Sprite( sprites.flowerBottom1 ))
        flowers.push(new Sprite( sprites.flowerBottom2 ))
        this.addChild(...flowers)
        return flowers
    }
}

export default Background