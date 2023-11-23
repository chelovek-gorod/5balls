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
    bgMusic = sound.add('bgm', bgMusicList[bgMusicIndex] )
    bgMusic.play().then( instance => instance.on('end', nextBgMusic) )
}

function nextBgMusic() {
    bgMusicIndex++
    if (bgMusicIndex === bgMusicList.length) bgMusicIndex = 0
    sound.remove('bgm')
    bgMusic = sound.add('bgm', bgMusicList[bgMusicIndex] )
    bgMusic.play().then( instance => instance.on('end', nextBgMusic) )
}

addEventListener('keyup', key => {
    switch(key.code) {
        case 'Numpad1' : playSound(sounds.clear); break;
        case 'Numpad2' : playSound(sounds.click); break;
        case 'Numpad3' : playSound(sounds.false); break;
        case 'Numpad4' : playSound(sounds.help); break;
        case 'Numpad5' : playSound(sounds.lose); break;
        case 'Numpad6' : playSound(sounds.slide); break;
        case 'Numpad7' : playSound(sounds.sphere); break;
        case 'Numpad8' : playSound(sounds.start); break;
        case 'Numpad9' : playSound(sounds.true); break;
    }
})

document.body.onclick = () => {
    if (sounds) {
        const soundsList = Object.values(sounds)
        const soundIndex = Math.floor( Math.random() * soundsList.length )
        playSound(soundsList[soundIndex])
    }
}