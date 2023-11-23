const constants = {
    tick: 16.66, // milliseconds
    // getTickRate -> time / tick
}

// timers (milliseconds)
constants.smoothInOutTime = 600
constants.slideInOutTime = 900
constants.slideNextDelay = 300
constants.startLevelDelay = 600
constants.messageMoveTime = 1200
constants.messageInTime = 300
constants.messageOutTime = 600
constants.messageRestTime = constants.messageMoveTime - (constants.messageInTime + constants.messageOutTime)

// steps alpha
constants.smoothStepAlpha = 1 / (constants.smoothInOutTime / constants.tick)
constants.messageInStepAlpha = 1 / (constants.messageInTime / constants.tick)
constants.messageOutStepAlpha = 1 / (constants.messageOutTime / constants.tick)

// messages
constants.messageFontSizeRateByScreenMinSize = 0.06

// board
constants.boardSprite = {
    size: 1416,
    offsetX: 27,
    offsetY: 183,
    stepX: 150,
    stepY: 130,
    halfStepX: 75,
    halfStepY: 65,
}

// balls
constants.ballSpriteSize = 142
constants.ballSpriteSizeRate = 10

constants.ballsAtStart = 5

constants.ballKeys = {
    red : 'red',
    yellow : 'yellow',
    green: 'green',
    blue : 'blue',
    purple : 'purple',
    brown : 'brown',
    aqua : 'aqua',
    stone : 'stone',
    pink : 'pink',
    color : 'color'
}
constants.ballKeysSize = Object.keys(constants.ballKeys).length

constants.ballsOrder = [
    { color: constants.ballKeys.red, closed: 0},
    { color: constants.ballKeys.yellow, closed: 0},
    { color: constants.ballKeys.green, closed: 0},
    { color: constants.ballKeys.blue, closed: 0},

    { color: constants.ballKeys.purple, closed: 25},
    { color: constants.ballKeys.brown, closed: 50},
    { color: constants.ballKeys.aqua, closed: 100},
    { color: constants.ballKeys.pink, closed: 200},
    { color: constants.ballKeys.stone, closed: 500},
]

constants.turnsForKey = 10

/*
1 = 1
2 = 3
2 = 5
3 = 8
3 = 11
3 = 14
4 = 18
4 = 22
4 = 26
4 = 30
*/

constants.colorBallStartIndex = 5
constants.colorBallNextIndexRate = 2

constants.reserve1 = {x: 158, y: 148, scale: 0.92}
constants.reserve2 = {x: 101, y: 91, scale: 0.76}
constants.reserve3 = {x: 58, y: 48, scale: 0.62}

// Star
constants.star = {
    stars: 5,
    size: 150,
    scaleRate: 120
}
constants.star.delay = constants.star.scaleRate / constants.star.stars

// lock
constants.lockSprite = {
    width: 116,
    height: 126
}

export default constants