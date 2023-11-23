import { Container, Graphics, Text } from 'pixi.js'
import { textStyles } from './fonts'
import { getAppScreen, Layer } from './application'
import { EventHub, events } from './events'

const settings = {
    width: 270,
    height: 90,
}
settings.halfWidth = settings.width / 2
settings.halfHeight = settings.height / 2
settings.sidePoints = 100 / 8 // 12.5% in half side
settings.stepH = settings.halfWidth / settings.sidePoints
settings.stepV = settings.halfHeight / settings.sidePoints

class LoadingBar extends Container {
    constructor() {
        super()
        this.poly = new Graphics()
        this.addChild(this.poly)

        this.ellipse = new Graphics()
        this.ellipse.beginFill(0x00ff00)
        this.ellipse.drawEllipse( 0, 0, settings.halfWidth, settings.halfHeight)
        this.ellipse.endFill()
        this.ellipse.mask = this.poly
        this.addChild(this.ellipse)

        this.text = new Text('0 %', textStyles.loading)
        this.text.anchor.set(0.5, 1)
        this.text.position.y = 10
        this.addChild(this.text)

        EventHub.on( events.screenResize, screenResize )
        this.layer = new Layer(this)
    }

    update(progress) {
        const range = Math.round(progress)
        let size = 0
        this.poly.clear()
        this.poly.beginFill()
        if (range < settings.sidePoints) {
            // < 12.5 %
            size = range
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, range * settings.stepV,
            ]);
        } else if (range < settings.sidePoints * 2) {
            // < 25 %
            size = range - settings.sidePoints
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                settings.halfWidth - size * settings.stepH, settings.halfHeight,
            ]);
        } else if (range < settings.sidePoints * 3) {
            // < 37.5 %
            size = range - settings.sidePoints * 2
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -size * settings.stepH, settings.halfHeight,
            ]);
        } else if (range < settings.sidePoints * 4) {
            // < 50 %
            size = range - settings.sidePoints * 3
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight - size * settings.stepV,
            ]);
        } else if (range < settings.sidePoints * 5) {
            // < 62.5 %
            size = range - settings.sidePoints * 4
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, 0,
                -settings.halfWidth, -size * settings.stepV,
            ]);
        } else if (range < settings.sidePoints * 6) {
            // < 75 %
            size = range - settings.sidePoints * 5
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, -settings.halfHeight,
                -settings.halfWidth + size * settings.stepH, -settings.halfHeight,
            ]);
        } else if (range < settings.sidePoints * 7) {
            // < 87.5 %
            size = range - settings.sidePoints * 6
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, -settings.halfHeight,
                size * settings.stepH, -settings.halfHeight,
            ]);
        } else {
            // >= 87.5 %
            size = range - settings.sidePoints * 7
            this.poly.drawPolygon([
                0, 0,
                settings.halfWidth, 0,
                settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, settings.halfHeight,
                -settings.halfWidth, -settings.halfHeight,
                settings.halfWidth, -settings.halfHeight,
                settings.halfWidth, -settings.halfHeight + size * settings.stepV,
            ]);
        }
        this.poly.endFill();
        this.text.text = range + ' %'
    }
}

let loadingBar = null

function screenResize(screenData) {
    if (!loadingBar) return

    loadingBar.position.x = screenData.centerX
    loadingBar.position.y = screenData.centerY
}

export function getLoadingBar() {
    if (!loadingBar) {
        loadingBar = new LoadingBar()
        screenResize( getAppScreen() )
    }
    return loadingBar
}

export function removeLoadingBar() {
    if (!loadingBar) return

    EventHub.off( events.screenResize, screenResize )
    loadingBar.layer.removeLayer()
}