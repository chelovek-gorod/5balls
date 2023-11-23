import { Container, Sprite, Graphics } from "pixi.js"
import { sprites } from "./loader"
import constants from "./constants"
import { getAppScreen } from "./application"
import { EventHub, events } from './events'
import { clickCeil } from './game'
import getBall from "./ball"
import Lock from "./lock"
import getStars from "./star"

const boardCeilFillKeys = {
    lock: 'lock',
    free: 'free',
    ball: 'ball',
    next: 'next',
}

// ball -> link to sprite

export const boardCeils = {
    a1 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a2', 'b2', 'b1', null], fill: 'lock', ball: null},
    a2 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a3', 'b3', 'b2', 'a1'], fill: 'lock', ball: null},
    a3 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a4', 'b4', 'b3', 'a2'], fill: 'lock', ball: null},
    a4 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a5', 'b5', 'b4', 'a3'], fill: 'lock', ball: null},
    a5 : {position: {x: 0, y: 0}, neighboring: [null, null, null, 'b6', 'b5', 'a4'], fill: 'lock', ball: null},

    b1 : {position: {x: 0, y: 0}, neighboring: [null, 'a1', 'b2', 'c2', 'c1', null], fill: 'lock', ball: null},
    b2 : {position: {x: 0, y: 0}, neighboring: ['a1', 'a2', 'b3', 'c3', 'c2', 'b1'], fill: 'lock', ball: null},
    b3 : {position: {x: 0, y: 0}, neighboring: ['a2', 'a3', 'b4', 'c4', 'c3', 'b2'], fill: 'free', ball: null},
    b4 : {position: {x: 0, y: 0}, neighboring: ['a3', 'a4', 'b5', 'c5', 'c4', 'b3'], fill: 'free', ball: null},
    b5 : {position: {x: 0, y: 0}, neighboring: ['a4', 'a5', 'b6', 'c6', 'c5', 'b4'], fill: 'lock', ball: null},
    b6 : {position: {x: 0, y: 0}, neighboring: ['a5', null, null, 'c7', 'c6', 'b5'], fill: 'lock', ball: null},

    c1 : {position: {x: 0, y: 0}, neighboring: [null, 'b1', 'c2', 'd2', 'd1', null], fill: 'lock', ball: null},
    c2 : {position: {x: 0, y: 0}, neighboring: ['b1', 'b2', 'c3', 'd3', 'd2', 'c1'], fill: 'free', ball: null},
    c3 : {position: {x: 0, y: 0}, neighboring: ['b2', 'b3', 'c4', 'd4', 'd3', 'c2'], fill: 'free', ball: null},
    c4 : {position: {x: 0, y: 0}, neighboring: ['b3', 'b4', 'c5', 'd5', 'd4', 'c3'], fill: 'free', ball: null},
    c5 : {position: {x: 0, y: 0}, neighboring: ['b4', 'b5', 'c6', 'd6', 'd5', 'c4'], fill: 'free', ball: null},
    c6 : {position: {x: 0, y: 0}, neighboring: ['b5', 'b6', 'c7', 'd7', 'd6', 'c5'], fill: 'free', ball: null},
    c7 : {position: {x: 0, y: 0}, neighboring: ['b6', null, null, 'd8', 'd7', 'c6'], fill: 'lock', ball: null},

    d1 : {position: {x: 0, y: 0}, neighboring: [null, 'c1', 'd2', 'e2', 'e1', null], fill: 'lock', ball: null},
    d2 : {position: {x: 0, y: 0}, neighboring: ['c1', 'c2', 'd3', 'e3', 'e2', 'd1'], fill: 'free', ball: null},
    d3 : {position: {x: 0, y: 0}, neighboring: ['c2', 'c3', 'd4', 'e4', 'e3', 'd2'], fill: 'free', ball: null},
    d4 : {position: {x: 0, y: 0}, neighboring: ['c3', 'c4', 'd5', 'e5', 'e4', 'd3'], fill: 'free', ball: null},
    d5 : {position: {x: 0, y: 0}, neighboring: ['c4', 'c5', 'd6', 'e6', 'e5', 'd4'], fill: 'free', ball: null},
    d6 : {position: {x: 0, y: 0}, neighboring: ['c5', 'c6', 'd7', 'e7', 'e6', 'd5'], fill: 'free', ball: null},
    d7 : {position: {x: 0, y: 0}, neighboring: ['c6', 'c7', 'd8', 'e8', 'e7', 'd6'], fill: 'free', ball: null},
    d8 : {position: {x: 0, y: 0}, neighboring: ['c7', null, null, 'e9', 'e8', 'd7'], fill: 'lock', ball: null},

    e1 : {position: {x: 0, y: 0}, neighboring: [null, 'd1', 'e2', 'f2', null, null], fill: 'lock', ball: null},
    e2 : {position: {x: 0, y: 0}, neighboring: ['d1', 'd2', 'e3', 'f3', 'f2', 'e1'], fill: 'lock', ball: null},
    e3 : {position: {x: 0, y: 0}, neighboring: ['d2', 'd3', 'e4', 'f4', 'f3', 'e2'], fill: 'free', ball: null},
    e4 : {position: {x: 0, y: 0}, neighboring: ['d3', 'd4', 'e5', 'f5', 'f4', 'e3'], fill: 'free', ball: null},
    e5 : {position: {x: 0, y: 0}, neighboring: ['d4', 'd5', 'e6', 'f6', 'f5', 'e4'], fill: 'free', ball: null},
    e6 : {position: {x: 0, y: 0}, neighboring: ['d5', 'd6', 'e7', 'f7', 'f6', 'e5'], fill: 'free', ball: null},
    e7 : {position: {x: 0, y: 0}, neighboring: ['d6', 'd7', 'e8', 'f8', 'f7', 'e6'], fill: 'free', ball: null},
    e8 : {position: {x: 0, y: 0}, neighboring: ['d7', 'd8', 'e9', 'f9', 'f8', 'e7'], fill: 'lock', ball: null},
    e9 : {position: {x: 0, y: 0}, neighboring: ['d8', null, null, null, 'f9', 'e8'], fill: 'lock', ball: null},

    f2 : {position: {x: 0, y: 0}, neighboring: ['e1', 'e2', 'f3', 'g3', null, null], fill: 'lock', ball: null},
    f3 : {position: {x: 0, y: 0}, neighboring: ['e2', 'e3', 'f4', 'g4', 'g3', 'f2'], fill: 'free', ball: null},
    f4 : {position: {x: 0, y: 0}, neighboring: ['e3', 'e4', 'f5', 'g5', 'g4', 'f3'], fill: 'free', ball: null},
    f5 : {position: {x: 0, y: 0}, neighboring: ['e4', 'e5', 'f6', 'g6', 'g5', 'f4'], fill: 'free', ball: null},
    f6 : {position: {x: 0, y: 0}, neighboring: ['e5', 'e6', 'f7', 'g7', 'g6', 'f5'], fill: 'free', ball: null},
    f7 : {position: {x: 0, y: 0}, neighboring: ['e6', 'e7', 'f8', 'g8', 'g7', 'f6'], fill: 'free', ball: null},
    f8 : {position: {x: 0, y: 0}, neighboring: ['e7', 'e8', 'f9', 'g9', 'g8', 'f7'], fill: 'free', ball: null},
    f9 : {position: {x: 0, y: 0}, neighboring: ['e8', 'e9', null, null, 'g9', 'f8'], fill: 'lock', ball: null},

    g3 : {position: {x: 0, y: 0}, neighboring: ['f2', 'f3', 'g4', 'h4', null, null], fill: 'lock', ball: null},
    g4 : {position: {x: 0, y: 0}, neighboring: ['f3', 'f4', 'g5', 'h5', 'h4', 'g3'], fill: 'free', ball: null},
    g5 : {position: {x: 0, y: 0}, neighboring: ['f4', 'f5', 'g6', 'h6', 'h5', 'g4'], fill: 'free', ball: null},
    g6 : {position: {x: 0, y: 0}, neighboring: ['f5', 'f6', 'g7', 'h7', 'h6', 'g5'], fill: 'free', ball: null},
    g7 : {position: {x: 0, y: 0}, neighboring: ['f6', 'f7', 'g8', 'h8', 'h7', 'g6'], fill: 'free', ball: null},
    g8 : {position: {x: 0, y: 0}, neighboring: ['f7', 'f8', 'g9', 'h9', 'h8', 'g7'], fill: 'free', ball: null},
    g9 : {position: {x: 0, y: 0}, neighboring: ['f8', 'f9', null, null, 'h9', 'g8'], fill: 'lock', ball: null},

    h4 : {position: {x: 0, y: 0}, neighboring: ['g3', 'g4', 'h5', 'i5', null, null], fill: 'lock', ball: null},
    h5 : {position: {x: 0, y: 0}, neighboring: ['g4', 'g5', 'h6', 'i6', 'i5', 'h4'], fill: 'lock', ball: null},
    h6 : {position: {x: 0, y: 0}, neighboring: ['g5', 'g6', 'h7', 'i7', 'i6', 'h5'], fill: 'free', ball: null},
    h7 : {position: {x: 0, y: 0}, neighboring: ['g6', 'g7', 'h8', 'i8', 'i7', 'h6'], fill: 'free', ball: null},
    h8 : {position: {x: 0, y: 0}, neighboring: ['g7', 'g8', 'h9', 'i9', 'i8', 'h7'], fill: 'lock', ball: null},
    h9 : {position: {x: 0, y: 0}, neighboring: ['g8', 'g9', null, null, 'i9', 'h8'], fill: 'lock', ball: null},

    i5 : {position: {x: 0, y: 0}, neighboring: ['h4', 'h5', 'i6', null, null, null], fill: 'lock', ball: null},
    i6 : {position: {x: 0, y: 0}, neighboring: ['h5', 'h6', 'i7', null, null, 'i5'], fill: 'lock', ball: null},
    i7 : {position: {x: 0, y: 0}, neighboring: ['h6', 'h7', 'i8', null, null, 'i6'], fill: 'lock', ball: null},
    i8 : {position: {x: 0, y: 0}, neighboring: ['h7', 'h8', 'i9', null, null, 'i7'], fill: 'lock', ball: null},
    i9 : {position: {x: 0, y: 0}, neighboring: ['h8', 'h9', null, null, null, 'i8'], fill: 'lock', ball: null},
}

const keys = Object.keys(boardCeils)
let lineX = constants.boardSprite.offsetX + constants.boardSprite.halfStepX + constants.boardSprite.stepX * 2
let lineY = constants.boardSprite.offsetY + constants.boardSprite.halfStepY
let lineCeils = [5, 6, 7, 8, 9, 8, 7, 6, 5]
let ceilIndex = 0
for (let line=0; line<lineCeils.length; line++) {
    let previousLineX = lineX
    for(let i=0; i<lineCeils[line]; i++){
        boardCeils[keys[ceilIndex]].position.x = lineX
        boardCeils[keys[ceilIndex]].position.y = lineY
        lineX += constants.boardSprite.stepX
        ceilIndex++
    }
    if (line < 4) lineX = previousLineX - constants.boardSprite.halfStepX
    else lineX = previousLineX + constants.boardSprite.halfStepX
    lineY += constants.boardSprite.stepY
}

class Board extends Container {
    constructor(screenData) {
        super()
        this.screenData = screenData
        this.image = new Sprite(sprites.board)
        //this.image.anchor.set(0.5)
        this.addChild(this.image)
        this.state = {...boardCeils}
        this.taps = []
        for (let i = 0; i < keys.length; i++) {
            const tap = new Graphics()
            tap.key = keys[i]
            tap.eventMode = 'static'
            tap.on('pointertap', this.ceilClick.bind(this, keys[i]) )
            this.taps.push(tap)
            this.addChild(tap)

            if (this.state[keys[i]].fill === boardCeilFillKeys.lock) this.addLock( keys[i] )
        }
        this.nextBallCeilKey = null
        this.reserve = []
        this.scaleRate = 1
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )
    }

    ballFromReserve(key, color) {
        const nextBall = this.reserve.shift()
        this.addBall(key, nextBall.color)
        nextBall.hide(() => this.updateReserve(color))
    }

    updateReserve(color) {
        console.log( this.reserve[0].color, this.reserve[1].color )
        this.reserve[0].position.x = constants.reserve1.x
        this.reserve[0].position.y = constants.reserve1.y
    }

    nextBallReserve(color) {
        const reserveIndex = 'reserve' + (this.reserve.length + 1)
        const x = constants[reserveIndex].x
        const y = constants[reserveIndex].y
        const scale = constants[reserveIndex].scale
        this.reserve.push( getBall(color, x, y, this.screenData, scale) )
        this.addChildAt( this.reserve[this.reserve.length - 1], 1 )
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

    nextBallPosition(color) {
        const ceilKey = this.getRandomFreeCeil()
        if (ceilKey === null) {
            alert('GAME OVER')
            return document.location.reload()
        }

        this.nextBallCeilKey = ceilKey
        const ceil = this.state[ceilKey]
        ceil.fill = boardCeilFillKeys.next
        ceil.ball = getStars( color, ceil.position.x, ceil.position.y, this.screenData )
        this.addChild( ...ceil.ball )
    }

    ceilClick(key) {
        if (this.state[key].fill !== boardCeilFillKeys.free) return null
        else clickCeil( key )
    }

    addBall(key, color) {
        if (this.state[key].fill !== boardCeilFillKeys.free) return

        this.state[key].fill = boardCeilFillKeys.ball
        const ballX = this.state[key].position.x
        const ballY = this.state[key].position.y
        this.state[key].ball = getBall( color, ballX, ballY, this.screenData )
        this.addChild( this.state[key].ball )
    }

    addLock(key) {
        const lockX = this.state[key].position.x
        const lockY = this.state[key].position.y
        this.state[key].ball = new Lock( lockX, lockY, this.screenData )
        this.addChild( this.state[key].ball )
    }

    screenResize(screenData) {
        this.screenData = screenData
        this.image.width = this.image.height = screenData.minSize
        this.image.position.x = screenData.offsetX
        this.image.position.y = screenData.offsetY

        this.taps.forEach( tap => {
            tap.clear()
            const x = screenData.offsetX + boardCeils[tap.key].position.x * screenData.scaleRate
            const y = screenData.offsetY + boardCeils[tap.key].position.y * screenData.scaleRate
            tap.beginFill(0x000000, 0.0001)
            //tap.beginFill(0xff0000, 0.5)
            tap.arc(x, y, 64 * screenData.scaleRate, 0, Math.PI * 2)
            tap.endFill()
        })
    }
}

let board = null

export default function getBoard() {
    if (!board) board = new Board( getAppScreen() )
    return board
}