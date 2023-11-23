import { sound } from '@pixi/sound'
import { sounds, music } from './loader'

let isSoundOn = true

function playSound( se ) {
    if (!isSoundOn) return

    se.stop()
    se.play()
}

let bgMusicList = null
let bgMusicIndex = 0
let bgMusic = null

export function stopMusic() {
    if (!bgMusic) return
    bgMusic.pause()
}

export function playMusic() {
    if (bgMusic) return bgMusic.isPlaying ? null : bgMusic.resume()

    if (!bgMusicList) bgMusicList = Object.values(music)
    bgMusicPlay()
}

function bgMusicPlay() {
    bgMusic = sound.add('bgm', bgMusicList[bgMusicIndex] )
    bgMusic.play({ volume: 0.3 }).then( instance => instance.on('end', nextBgMusic) )
}

function nextBgMusic() {
    bgMusicIndex++
    if (bgMusicIndex === bgMusicList.length) bgMusicIndex = 0
    sound.remove('bgm')
    bgMusicPlay()
}

// TEST SOUND EFFECTS
let soundsList = null
let seIndex = 0
document.body.onclick = () => {
    if (sounds) {
        if (!soundsList) {
            soundsList = Object.values(sounds)
            console.log(Object.keys(sounds))
        }
        //const soundsList = Object.values(sounds)
        //const soundIndex = Math.floor( Math.random() * soundsList.length )
        playSound(soundsList[seIndex])
        seIndex++
        if (seIndex === soundsList.length) seIndex = 0
    }
}