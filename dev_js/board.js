import { Container, Sprite, Graphics } from "pixi.js"
import { sprites } from "./loader"
import { EventHub, events } from './events'
import { clickCeil } from './game'
import getBall, { ballAnimationTime, ballKeys } from "./ball"
import Lock from "./lock"
import getStars from "./star"

const boardSettings = {
    size: 1480,
    offsetX: 140,
    offsetY: 310,
    stepX: 150,
    stepY: 130,
    halfStepX: 75,
    halfStepY: 65,

    tapSize: 60,

    reserve: [
        {x: 234, y: 98, scale: 0.65},
        {x: 171, y: 87, scale: 0.5},
        {x: 117, y: 75, scale: 0.35},
    ],
}

const boardCeilFillKeys = {
    lock: 'lock',
    free: 'free',
    ball: 'ball',
    next: 'next',
}

export const boardCeils = {
    a1 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a2', 'b2', 'b1', null], fill: 'lock', sprites: []},
    a2 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a3', 'b3', 'b2', 'a1'], fill: 'lock', sprites: []},
    a3 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a4', 'b4', 'b3', 'a2'], fill: 'lock', sprites: []},
    a4 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a5', 'b5', 'b4', 'a3'], fill: 'lock', sprites: []},
    a5 : {position: {x: 0, y: 0}, neighboring: [null, null, null, 'b6', 'b5', 'a4'], fill: 'lock', sprites: []},

    b1 : {position: {x: 0, y: 0}, neighboring: [null, 'a1', 'b2', 'c2', 'c1', null], fill: 'lock', sprites: []},
    b2 : {position: {x: 0, y: 0}, neighboring: ['a1', 'a2', 'b3', 'c3', 'c2', 'b1'], fill: 'lock', sprites: []},
    b3 : {position: {x: 0, y: 0}, neighboring: ['a2', 'a3', 'b4', 'c4', 'c3', 'b2'], fill: 'free', sprites: []},
    b4 : {position: {x: 0, y: 0}, neighboring: ['a3', 'a4', 'b5', 'c5', 'c4', 'b3'], fill: 'free', sprites: []},
    b5 : {position: {x: 0, y: 0}, neighboring: ['a4', 'a5', 'b6', 'c6', 'c5', 'b4'], fill: 'lock', sprites: []},
    b6 : {position: {x: 0, y: 0}, neighboring: ['a5', null, null, 'c7', 'c6', 'b5'], fill: 'lock', sprites: []},

    c1 : {position: {x: 0, y: 0}, neighboring: [null, 'b1', 'c2', 'd2', 'd1', null], fill: 'lock', sprites: []},
    c2 : {position: {x: 0, y: 0}, neighboring: ['b1', 'b2', 'c3', 'd3', 'd2', 'c1'], fill: 'free', sprites: []},
    c3 : {position: {x: 0, y: 0}, neighboring: ['b2', 'b3', 'c4', 'd4', 'd3', 'c2'], fill: 'free', sprites: []},
    c4 : {position: {x: 0, y: 0}, neighboring: ['b3', 'b4', 'c5', 'd5', 'd4', 'c3'], fill: 'free', sprites: []},
    c5 : {position: {x: 0, y: 0}, neighboring: ['b4', 'b5', 'c6', 'd6', 'd5', 'c4'], fill: 'free', sprites: []},
    c6 : {position: {x: 0, y: 0}, neighboring: ['b5', 'b6', 'c7', 'd7', 'd6', 'c5'], fill: 'free', sprites: []},
    c7 : {position: {x: 0, y: 0}, neighboring: ['b6', null, null, 'd8', 'd7', 'c6'], fill: 'lock', sprites: []},

    d1 : {position: {x: 0, y: 0}, neighboring: [null, 'c1', 'd2', 'e2', 'e1', null], fill: 'lock', sprites: []},
    d2 : {position: {x: 0, y: 0}, neighboring: ['c1', 'c2', 'd3', 'e3', 'e2', 'd1'], fill: 'free', sprites: []},
    d3 : {position: {x: 0, y: 0}, neighboring: ['c2', 'c3', 'd4', 'e4', 'e3', 'd2'], fill: 'free', sprites: []},
    d4 : {position: {x: 0, y: 0}, neighboring: ['c3', 'c4', 'd5', 'e5', 'e4', 'd3'], fill: 'free', sprites: []},
    d5 : {position: {x: 0, y: 0}, neighboring: ['c4', 'c5', 'd6', 'e6', 'e5', 'd4'], fill: 'free', sprites: []},
    d6 : {position: {x: 0, y: 0}, neighboring: ['c5', 'c6', 'd7', 'e7', 'e6', 'd5'], fill: 'free', sprites: []},
    d7 : {position: {x: 0, y: 0}, neighboring: ['c6', 'c7', 'd8', 'e8', 'e7', 'd6'], fill: 'free', sprites: []},
    d8 : {position: {x: 0, y: 0}, neighboring: ['c7', null, null, 'e9', 'e8', 'd7'], fill: 'lock', sprites: []},

    e1 : {position: {x: 0, y: 0}, neighboring: [null, 'd1', 'e2', 'f2', null, null], fill: 'lock', sprites: []},
    e2 : {position: {x: 0, y: 0}, neighboring: ['d1', 'd2', 'e3', 'f3', 'f2', 'e1'], fill: 'lock', sprites: []},
    e3 : {position: {x: 0, y: 0}, neighboring: ['d2', 'd3', 'e4', 'f4', 'f3', 'e2'], fill: 'free', sprites: []},
    e4 : {position: {x: 0, y: 0}, neighboring: ['d3', 'd4', 'e5', 'f5', 'f4', 'e3'], fill: 'free', sprites: []},
    e5 : {position: {x: 0, y: 0}, neighboring: ['d4', 'd5', 'e6', 'f6', 'f5', 'e4'], fill: 'free', sprites: []},
    e6 : {position: {x: 0, y: 0}, neighboring: ['d5', 'd6', 'e7', 'f7', 'f6', 'e5'], fill: 'free', sprites: []},
    e7 : {position: {x: 0, y: 0}, neighboring: ['d6', 'd7', 'e8', 'f8', 'f7', 'e6'], fill: 'free', sprites: []},
    e8 : {position: {x: 0, y: 0}, neighboring: ['d7', 'd8', 'e9', 'f9', 'f8', 'e7'], fill: 'lock', sprites: []},
    e9 : {position: {x: 0, y: 0}, neighboring: ['d8', null, null, null, 'f9', 'e8'], fill: 'lock', sprites: []},

    f2 : {position: {x: 0, y: 0}, neighboring: ['e1', 'e2', 'f3', 'g3', null, null], fill: 'lock', sprites: []},
    f3 : {position: {x: 0, y: 0}, neighboring: ['e2', 'e3', 'f4', 'g4', 'g3', 'f2'], fill: 'free', sprites: []},
    f4 : {position: {x: 0, y: 0}, neighboring: ['e3', 'e4', 'f5', 'g5', 'g4', 'f3'], fill: 'free', sprites: []},
    f5 : {position: {x: 0, y: 0}, neighboring: ['e4', 'e5', 'f6', 'g6', 'g5', 'f4'], fill: 'free', sprites: []},
    f6 : {position: {x: 0, y: 0}, neighboring: ['e5', 'e6', 'f7', 'g7', 'g6', 'f5'], fill: 'free', sprites: []},
    f7 : {position: {x: 0, y: 0}, neighboring: ['e6', 'e7', 'f8', 'g8', 'g7', 'f6'], fill: 'free', sprites: []},
    f8 : {position: {x: 0, y: 0}, neighboring: ['e7', 'e8', 'f9', 'g9', 'g8', 'f7'], fill: 'free', sprites: []},
    f9 : {position: {x: 0, y: 0}, neighboring: ['e8', 'e9', null, null, 'g9', 'f8'], fill: 'lock', sprites: []},

    g3 : {position: {x: 0, y: 0}, neighboring: ['f2', 'f3', 'g4', 'h4', null, null], fill: 'lock', sprites: []},
    g4 : {position: {x: 0, y: 0}, neighboring: ['f3', 'f4', 'g5', 'h5', 'h4', 'g3'], fill: 'free', sprites: []},
    g5 : {position: {x: 0, y: 0}, neighboring: ['f4', 'f5', 'g6', 'h6', 'h5', 'g4'], fill: 'free', sprites: []},
    g6 : {position: {x: 0, y: 0}, neighboring: ['f5', 'f6', 'g7', 'h7', 'h6', 'g5'], fill: 'free', sprites: []},
    g7 : {position: {x: 0, y: 0}, neighboring: ['f6', 'f7', 'g8', 'h8', 'h7', 'g6'], fill: 'free', sprites: []},
    g8 : {position: {x: 0, y: 0}, neighboring: ['f7', 'f8', 'g9', 'h9', 'h8', 'g7'], fill: 'free', sprites: []},
    g9 : {position: {x: 0, y: 0}, neighboring: ['f8', 'f9', null, null, 'h9', 'g8'], fill: 'lock', sprites: []},

    h4 : {position: {x: 0, y: 0}, neighboring: ['g3', 'g4', 'h5', 'i5', null, null], fill: 'lock', sprites: []},
    h5 : {position: {x: 0, y: 0}, neighboring: ['g4', 'g5', 'h6', 'i6', 'i5', 'h4'], fill: 'lock', sprites: []},
    h6 : {position: {x: 0, y: 0}, neighboring: ['g5', 'g6', 'h7', 'i7', 'i6', 'h5'], fill: 'free', sprites: []},
    h7 : {position: {x: 0, y: 0}, neighboring: ['g6', 'g7', 'h8', 'i8', 'i7', 'h6'], fill: 'free', sprites: []},
    h8 : {position: {x: 0, y: 0}, neighboring: ['g7', 'g8', 'h9', 'i9', 'i8', 'h7'], fill: 'lock', sprites: []},
    h9 : {position: {x: 0, y: 0}, neighboring: ['g8', 'g9', null, null, 'i9', 'h8'], fill: 'lock', sprites: []},

    i5 : {position: {x: 0, y: 0}, neighboring: ['h4', 'h5', 'i6', null, null, null], fill: 'lock', sprites: []},
    i6 : {position: {x: 0, y: 0}, neighboring: ['h5', 'h6', 'i7', null, null, 'i5'], fill: 'lock', sprites: []},
    i7 : {position: {x: 0, y: 0}, neighboring: ['h6', 'h7', 'i8', null, null, 'i6'], fill: 'lock', sprites: []},
    i8 : {position: {x: 0, y: 0}, neighboring: ['h7', 'h8', 'i9', null, null, 'i7'], fill: 'lock', sprites: []},
    i9 : {position: {x: 0, y: 0}, neighboring: ['h8', 'h9', null, null, null, 'i8'], fill: 'lock', sprites: []},
}

const keys = Object.keys(boardCeils)
let lineX = boardSettings.offsetX + boardSettings.stepX * 2
let lineY = boardSettings.offsetY 
let lineCeils = [5, 6, 7, 8, 9, 8, 7, 6, 5]
let ceilIndex = 0
for (let line=0; line < lineCeils.length; line++) {
    let previousLineX = lineX
    for(let i=0; i<lineCeils[line]; i++){
        boardCeils[keys[ceilIndex]].position.x = lineX
        boardCeils[keys[ceilIndex]].position.y = lineY
        lineX += boardSettings.stepX
        ceilIndex++
    }
    if (line < 4) lineX = previousLineX - boardSettings.halfStepX
    else lineX = previousLineX + boardSettings.halfStepX
    lineY += boardSettings.stepY
}

export function getCeilsClone( targetBoard = board ) {
    if (targetBoard === null) return console.warn('board is not exist')
    const clone = {}
    for (let ceil in targetBoard) {
        const ceilClone = {}
        for (let data in targetBoard[ceil]) {
            if (Array.isArray(targetBoard[ceil][data])) ceilClone[data] = [...targetBoard[ceil][data]]
            else if (typeof targetBoard[ceil][data] === 'object') ceilClone[data] = {...targetBoard[ceil][data]}
            else ceilClone[data] = targetBoard[ceil][data]
        }
        clone[ceil] = ceilClone
    }
    return clone
}

class Board extends Container {
    constructor(screenData, startColors, updateReserve, updateNextColor) {
        super()
        this.image = new Sprite(sprites.board)
        this.image.width = boardSettings.size
        this.image.height = boardSettings.size
        this.addChild(this.image)

        this.state = getCeilsClone( boardCeils )

        // fill board click points
        this.taps = []
        for (let i = 0; i < keys.length; i++) {
            const tap = new Graphics()
            tap.key = keys[i]
            tap.eventMode = 'static'
            tap.on('pointertap', this.ceilClick.bind(this, keys[i]) )
            this.taps.push(tap)
            this.addChild(tap)

            // add start locks
            if (this.state[keys[i]].fill === boardCeilFillKeys.lock) {
                const lockX = this.state[ keys[i] ].position.x
                const lockY = this.state[ keys[i] ].position.y
                const lock = new Lock( lockX, lockY )
                this.state[ keys[i] ].sprites.push(lock) 
                this.addChild( lock )
            }
        }

        this.updateReserve = updateReserve
        this.reserve = [
            this.updateReserve(), this.updateReserve(), this.updateReserve()
        ].map( (color, index) => {
            const x = boardSettings.reserve[ index ].x
            const y = boardSettings.reserve[ index ].y
            const scale = boardSettings.reserve[ index ].scale
            
            const ball = getBall( color, x, y, scale ) 
            this.addChildAt( ball, 3 - index )
            return ball
        })
        console.log('this.reserve', this.reserve)

        startColors.forEach( color => {
            let key = this.getRandomFreeCeil()
            this.addBall( key, color )
        })

        this.updateNextColor = updateNextColor
        this.nextBallColor = null
        this.nextBallCeilKey = null
        this.addStarsForNext()
       
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
    }

    screenResize(screenData) {
        this.position.x = screenData.offsetX
        this.position.y = screenData.offsetY
        this.scale.x = this.scale.y = screenData.minSize / boardSettings.size

        this.taps.forEach( tap => {
            tap.clear()
            const x = boardCeils[tap.key].position.x
            const y = boardCeils[tap.key].position.y
            tap.beginFill(0x000000, 0.0001)
            //tap.beginFill(0xff0000, 0.5)
            tap.arc(x, y, boardSettings.tapSize, 0, Math.PI * 2)
            tap.endFill()
        })
    }

    ceilClick(key) {
        if (this.state[key].fill !== boardCeilFillKeys.free) return null
        else clickCeil( key ) // function from game.js
    }
    getClick(key, color, callback) {
        // get click back if click is available
        this.addBall( key, this.getBallFromReserve(color) )
        setTimeout( this.checkColors.bind(this, key, callback ), ballAnimationTime )
    }
    getBallFromReserve(newReserveColor) {
        const ball = this.reserve.shift()
        const color = ball.color
        ball.hide()

        this.reserve[0].move( boardSettings.reserve[0] )
        this.reserve[1].move( boardSettings.reserve[1] )
        const x = boardSettings.reserve[2].x
        const y = boardSettings.reserve[2].y
        const scale = boardSettings.reserve[2].scale
        
        const newBall = getBall( newReserveColor, x, y, scale ) 
        this.reserve.push( newBall )
        this.addChildAt( newBall, 1 )

        return color
    }

    addBall( ceil, color, callback = null ) {
        if (this.nextBallCeilKey === ceil) {
            // check stars in ceil
            this.state[this.nextBallCeilKey].sprites.forEach( star => star.disappear() )
            setTimeout( this.replaceStarsForNext.bind(this), ballAnimationTime)
        }

        const x = this.state[ ceil ].position.x
        const y = this.state[ ceil ].position.y
        
        const ball = getBall( color, x, y, 1, callback )
        this.state[ ceil ].sprites.push(ball) 
        this.addChild( ball )
        this.state[ ceil ].fill = boardCeilFillKeys.ball
    }

    addStarsForNext() {
        this.nextBallColor = this.updateNextColor()
        this.replaceStarsForNext()
    }

    replaceStarsForNext() {
        this.nextBallCeilKey = this.getRandomFreeCeil()
        if (this.nextBallCeilKey) {
            const x = this.state[ this.nextBallCeilKey ].position.x
            const y = this.state[ this.nextBallCeilKey ].position.y
            this.state[ this.nextBallCeilKey ].sprites = getStars(this.nextBallColor , x, y)
            this.state[ this.nextBallCeilKey ].sprites.forEach( star => this.addChild( star ) )
        } else {
            alert('GAME OVER')
        }
    }

    getRandomFreeCeil() {
        const freeCeils = []
        for(let i = 0; i < keys.length; i++) {
            if (this.state[ keys[i] ].fill === boardCeilFillKeys.free) freeCeils.push( keys[i] )
        }
        if (freeCeils.length === 0) return null

        const index = Math.floor( Math.random() * freeCeils.length )
        return freeCeils[index]
    }

    checkColors( key, callback ) {
        if(callback) callback()
        // CHECK LINES IN SAME COLORS
        /*
        const index = this.state[key].sprites.length - 1 // if stars in ceil
        const ceilColor = this.state[key].sprites[index].color
        let testColor = null
        const lines = [[],[],[],[],[],[]]
        for(let line = 0; line <6; line++) {
            let lineKey = key
            while ( this.state[key].neighboring[i] !== null ) {
                // check ball and color
                lineKey = this.state[key].neighboring[i]
                if (this.state[lineKey].fill === boardCeilFillKeys.ball) {
                    if (ceilColor !== ballKeys.color && ) {

                    }
                } else break
            }
        }
        */
        console.log(key, ceilColor)
    }
}

let board = null

export default function getBoard(screenData, startColors, updateReserve, updateNextColor) {
    if (!board) board = new Board( screenData, startColors, updateReserve, updateNextColor )
    return board
}