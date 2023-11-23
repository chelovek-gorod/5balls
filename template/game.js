import { Sprite } from 'pixi.js'
import { Layer } from './application'
import Background from './background'
import getBoard from './board'
import constants from "./constants"
import { playMusic } from './sound'

const state = {
    turns : 0,
    score : 0,
    closed : 0,
    playerBalls: [],
    addedBalls: [],
    nextColorAtTurn: constants.colorBallStartIndex
}

function nextTurn() {
    state.turns++
    if (state.turns === state.nextColorAtTurn) {
        state.nextColorAtTurn *= constants.colorBallNextIndexRate
        state.playerBalls.push( constants.ballKeys.color )
    }
}

function updateAddedBalls() {
    if (state.addedBalls.length < constants.ballKeysSize) {
        const colors = []
        constants.ballsOrder.forEach( ball => {
            if (ball.closed <= state.closed) colors.push( ball.color )
        })
        colors.sort(() => Math.random() - 0.5)
        state.addedBalls = state.addedBalls.concat( colors )
    }
}

function updatePlayerBalls() {
    if (state.playerBalls.length < constants.ballKeysSize * 2) {
        const colors = []
        while (colors.length < constants.ballKeysSize) {
            constants.ballsOrder.forEach( ball => {
                if (ball.closed <= state.closed) colors.push( ball.color )
            })
        }
        colors.sort(() => Math.random() - 0.5)
        state.playerBalls = state.playerBalls.concat( colors )
    }
}

export function clickCeil(key) {
    console.log('clickCeil', key)
    getBoard().ballFromReserve(key, state.playerBalls.shift())
    updatePlayerBalls()
}

export function startGame() {
    const backgroundLayer = new Layer( new Background() )
    const gameBoard = getBoard()
    const gameBoardLayer = new Layer( gameBoard )
    //playMusic()
    updateAddedBalls()
    updatePlayerBalls()
    gameBoard.nextBallReserve(state.playerBalls.shift())
    gameBoard.nextBallReserve(state.playerBalls.shift())
    gameBoard.nextBallReserve(state.playerBalls.shift())
    for (let i = 0; i < constants.ballsAtStart; i++) {
        gameBoard.addBall( gameBoard.getRandomFreeCeil(), state.playerBalls.shift() )
        updatePlayerBalls()
    }
    gameBoard.nextBallPosition(state.addedBalls.shift())
    console.log({...state})
}