import { tickerAdd, tickerRemove } from './application'
import { constants } from './constants'

export function smoothShowElement( element, side = null, callback = null ) {
    switch(side) {
        case 'top' :
            element.smoothVisibilitySettings = {
                targetPosition : element.position.y,
                isVerticalAxis : true,
                step : (element.height / constants.inOutTime) * constants.tick,
            }
            element.position.y -= element.height
        break;
        case 'bottom' :
            element.smoothVisibilitySettings = {
                targetPosition : element.position.y,
                isVerticalAxis : true,
                step : -((element.height / constants.inOutTime) * constants.tick),
            }
            element.position.y += element.height
        break;
        case 'left' :
            element.smoothVisibilitySettings = {
                targetPosition : element.position.x,
                isVerticalAxis : false,
                step : (element.width / constants.inOutTime) * constants.tick,
            }
            element.position.x -= element.width
        break;
        case 'right' :
            element.smoothVisibilitySettings = {
                targetPosition : element.position.x,
                isVerticalAxis : false,
                step : -((element.width / constants.inOutTime) * constants.tick),
            }
            element.position.x -= element.width
        break;
        default: element.smoothVisibilitySettings = null
    }

    if (element.alpha) element.alpha = 0
    if (!element.visible) element.visible = true

    element.tick = (delta) =>{
        if(element.smoothVisibilitySettings) {
            if (element.smoothVisibilitySettings.isVerticalAxis) {
                element.position.y += element.smoothVisibilitySettings.step * delta
            } else {
                element.position.x += element.smoothVisibilitySettings.step * delta
            }
        }

        element.alpha += constants.smoothStepAlpha * delta

        if (element.alpha >= 1) {
            if (element.smoothVisibilitySettings) {
                if (element.smoothVisibilitySettings.isVerticalAxis) {
                    element.position.y = element.smoothVisibilitySettings.targetPosition
                } else {
                    element.position.x = element.smoothVisibilitySettings.targetPosition
                }
            }
            element.alpha = 1
            element.smoothVisibilitySettings = null
            tickerRemove( element )
            if (callback) callback()
        }
    }
    
    tickerAdd( element )
}

export function smoothHideElement( element, side = null, callback = null ) {
    switch(side) {
        case 'top' :
            element.smoothVisibilitySettings = {
                isVerticalAxis: true,
                targetPosition: element.position.y,
                step: -((element.height / constants.inOutTime) * constants.tick)
            }
        break;
        case 'bottom' :
            element.smoothVisibilitySettings = {
                isVerticalAxis: true,
                targetPosition: element.position.y,
                step: (element.height / constants.inOutTime) * constants.tick
            }
        break;
        case 'left' :
            element.smoothVisibilitySettings = {
                isVerticalAxis: false,
                targetPosition: element.position.x,
                step: -((element.width / constants.inOutTime) * constants.tick)
            }
        break;
        case 'right' :
            element.smoothVisibilitySettings = {
                isVerticalAxis: false,
                targetPosition: element.position.x,
                step: (element.width / constants.inOutTime) * constants.tick
            }
        break;
        default: element.smoothVisibilitySettings = null
    }

    element.tick = (delta) =>{
        if(element.smoothVisibilitySettings) {
            if (element.smoothVisibilitySettings.isVerticalAxis) {
                element.position.y += element.smoothVisibilitySettings.step * delta
            } else {
                element.position.x += element.smoothVisibilitySettings.step * delta
            }
        }

        element.alpha -= constants.smoothStepAlpha * delta

        if (element.alpha <= 0) {
            if (element.smoothVisibilitySettings) {
                if (element.smoothVisibilitySettings.isVerticalAxis) {
                    element.position.y = element.smoothVisibilitySettings.targetPosition
                } else {
                    element.position.x = element.smoothVisibilitySettings.targetPosition
                }
            }
            element.alpha = 0
            element.visible = false
            element.smoothVisibilitySettings = null
            tickerRemove( element )
            if (callback) callback()
        }
    }

    tickerAdd( element )
}