import { getAppScreen, Layer } from './application'
import Background from './background'
import getBoard from './board'
import { smoothShowElement } from './functions'
import { playMusic } from './sound'
import { encode, decode } from './decoder'
import { initState } from './state'

export function clickCeil(key) {
    if (!isClickAvailable) return

    const color = state.getTurn()
    board.getClick(key, color, () => isClickAvailable = true )
    isClickAvailable = false
}

let isClickAvailable = false

let state = null
let board = null
let boardLayer = null

export function startGame() {
    state = initState()
    
    const screenData = getAppScreen()
    const startColors = state.getStartColors()
    board = getBoard( screenData, startColors, state.getUseColor.bind(state), state.getAddColor.bind(state) )
    smoothShowElement( new Layer( new Background(screenData) ) , 'center', () => {
        boardLayer = new Layer(board)
        smoothShowElement( boardLayer )
    })
    
    playMusic()
    isClickAvailable = true
}