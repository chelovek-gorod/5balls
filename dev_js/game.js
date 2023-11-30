import { getAppScreen, Layer } from './application'
import Background from './background'
import getBoard from './board'
import { smoothShowElement } from './functions'
import { playMusic } from './sound'
import { encode, decode } from './decoder'
import { initState } from './state'
import { EventHub, events } from './events'

const lang = navigator.language || navigator.userLanguage
let isLangRu = !!(~lang.indexOf('ru'))
export function checkLangRu() {
    return isLangRu
}

let isClickAvailable = false
EventHub.on( events.activateUI, setUIActivation )
function setUIActivation( data ) {
    isClickAvailable = data
}
export function clickCeil(key) {
    if (!isClickAvailable) return

    isClickAvailable = false
    board.getClick(key)
}

let state = null
let board = null
let boardLayer = null

export function startGame() {
    state = initState()
    
    const screenData = getAppScreen()
    board = getBoard( screenData, state )
    smoothShowElement( new Layer( new Background(screenData) ) , 'center', () => {
        boardLayer = new Layer(board)
        smoothShowElement( boardLayer )
    })
    
    playMusic()
    isClickAvailable = true
}