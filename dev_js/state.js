import { ballKeys } from './ball'
import { getCeilsClone } from './board'

const ballsOrder = [
    { color: ballKeys.red, closed: 0},
    { color: ballKeys.yellow, closed: 0},
    { color: ballKeys.green, closed: 0},
    { color: ballKeys.blue, closed: 0},

    { color: ballKeys.purple, closed: 50}, // 50
    { color: ballKeys.brown, closed: 125}, // 75  +25
    { color: ballKeys.aqua, closed: 250},  // 125 +50
    { color: ballKeys.pink, closed: 450},  // 200 +75
    { color: ballKeys.stone, closed: 750}, // 300 +100
]

const settings = {
    ballsAtStart: 8,
    maxKeys: 30,
    nextKey: 5,
    nextRemove: 5,
    nextRemoveAdd: 1,
    nextColorBallTurn: 5,
    minReserveUseSize: 8,
    maxReserveUseSize: 24,
}

/*
keys
turns   :  add = all
10 (10) = 1(1) :  1..2
25 (15) = 2(2) :  3..6   
40 (15) = 2(2) :  5..10
60 (20) = 3(3) :  8..16
80 (20) = 3(3) : 11..22
100(20) = 3(3) : 14..28
125(25) = 4(4) : 18..30
150(25) = 4(4) : 22..30
175(25) = 4(4) : 26..30
200(25) = 4(4) : 30..30
*/

class State {
    constructor() {
        this.score = 0
        this.record = 0

        this.turns = 0
        this.closedBalls = 0

        this.keys = settings.maxKeys
        this.turnForBonus = settings.nextKey
        this.turnForRemove = settings.nextRemove
        this.turnForColorBall = settings.nextColorBallTurn
        this.colorBallRate = 1

        this.reserveUse = []
        this.reserveAdd = []

        this.board = null

        // for count balls index to add in reserveUse
        this.nextColorIndex = 0

        // get data from localStorage
        // or set start sate
        this.setState()
    }

    getState() {
        return {
            score: this.score,
            record: this.record,
            turns: this.turns,
            closedBalls: this.closedBalls,
            keys: this.keys,
            turnForBonus: this.turnForBonus,
            turnForRemove: this.turnForRemove,
            turnForColorBall: this.turnForColorBall,
            colorBallRate: this.colorBallRate,
            turnForColorBall: this.turnForColorBall,
            reserveUse: [...this.reserveUse],
            reserveAdd: [...this.reserveAdd],
            nextColorIndex: this.nextColorIndex,
            board: getCeilsClone(),
        }
    }

    getTurn( callback ) {
        this.turns++
        this.turnForBonus--
        if (this.turnForBonus === 0) {
            if (this.keys) {
                this.keys--
                this.turnForBonus = settings.nextKey
                callback('lock')
            } else {
                this.turnForBonus = this.turnForRemove
                this.turnForRemove += settings.nextRemoveAdd
                callback('ball')
            }
        } 
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
                this.turnForColorBall += settings.nextColorBallTurn + this.colorBallRate
            } else {
                this.nextColorIndex++
                if ( this.nextColorIndex === ballsOrder.length
                || ballsOrder[this.nextColorIndex].closed > this.closedBalls) this.nextColorIndex = 0
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

    setClosed( count ) {
        this.closedBalls += count
    }

    setScore( score ) {
        this.score += score
        if (this.score > this.record) this.record = this.score
    }

    getScore() {
        return { score: this.score, record: this.record }
    }
}

let STATE = null

export function initState() {
    if (STATE === null) STATE = new State()
    return STATE
}