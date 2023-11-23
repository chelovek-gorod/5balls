import { ballKeys } from './ball'
import { getCeilsClone } from './board'

const ballsOrder = [
    { color: ballKeys.red, closed: 0},
    { color: ballKeys.yellow, closed: 0},
    { color: ballKeys.green, closed: 0},
    { color: ballKeys.blue, closed: 0},

    { color: ballKeys.purple, closed: 25},
    { color: ballKeys.brown, closed: 50},
    { color: ballKeys.aqua, closed: 100},
    { color: ballKeys.pink, closed: 200},
    { color: ballKeys.stone, closed: 500},
]

const settings = {
    ballsAtStart: 8,
    nextKeyTurnsRate: 2,
    nextColorBallTurnsAdd: 5,
    minReserveUseSize: 12,
    maxReserveUseSize: 36,
}

/*
keys add
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

class State {
    constructor() {
        this.score = 0
        this.topScore = 0

        this.turns = 0
        this.closedBalls = 0

        this.turnForKey = 10
        this.turnForColorBall = settings.nextColorBallTurnsAdd

        this.reserveUse = []
        this.reserveAdd = []

        this.board = null

        // for count balls index to add in reserveUse
        this.nextColorIndex = 0
        this.colorBallRate = 1

        // get data from localStorage
        // or set start sate
        this.setState()
    }

    getState() {
        return {
            score: this.score,
            topScore: this.topScore,
            turns: this.turns,
            closedBalls: this.closedBalls,
            turnForKey: this.turnForKey,
            turnForColorBall: this.turnForColorBall,
            reserveUse: [...this.reserveUse],
            reserveAdd: [...this.reserveAdd],
            board: getCeilsClone(),
        }
    }

    getTurn() {
        this.turns++
        return this.getUseColor()
    }

    getUseColor() {
        let color = this.reserveUse.shift()
        if (this.reserveUse.length < settings.minReserveUseSize) this.updateReserveUse()
        console.log(this.reserveUse)
        return color
    }

    getAddColor() {
        const color = this.reserveAdd.pop()
        if (this.reserveAdd.length === 0) this.updateReserveAdd()
        return color
    }

    setState() {
        // get data from localStorage
        // or set start sate

        this.updateReserveUse()
        this.updateReserveAdd()
    }

    updateReserveUse() {
        let addedColors = []
        let turnsCounter = this.turns + this.reserveUse.length
        while (this.reserveUse.length + addedColors.length < settings.maxReserveUseSize) {
            turnsCounter++
            if (turnsCounter === this.turnForColorBall) {
                if (addedColors.length) {
                    addedColors.sort( () => Math.random() - 0.5 )
                    this.reserveUse = this.reserveUse.concat(addedColors)
                }
                this.reserveUse.push(ballKeys.color)
                addedColors = []
                this.colorBallRate++
                this.turnForColorBall += settings.nextColorBallTurnsAdd * this.colorBallRate
            } else {
                this.nextColorIndex++
                if (ballsOrder[this.nextColorIndex].closed > this.closedBalls) this.nextColorIndex = 0
                addedColors.push( ballsOrder[this.nextColorIndex].color )
            }
        }

        if (addedColors.length) {
            addedColors.sort( () => Math.random() - 0.5 )
            this.reserveUse = this.reserveUse.concat(addedColors)
        }

        console.log([...this.reserveUse])
    }

    updateReserveAdd() {
        const addedColors = []
        ballsOrder.forEach(order => {
            if (order.closed <= this.closedBalls) addedColors.push(order.color)
        })
        addedColors.sort( () => Math.random() - 0.5 )
        this.reserveAdd = this.reserveAdd.concat(addedColors)
    }

    getStartColors() {
        const colors = []
        let index = 0
        while(colors.length < settings.ballsAtStart) {
            if (ballsOrder[index].closed === 0) {
                colors.push( ballsOrder[index].color )
                index++
            }
            else index = 0
        }
        return colors
    }
}

let STATE = null

export function initState() {
    if (STATE === null) STATE = new State()
    return STATE
}