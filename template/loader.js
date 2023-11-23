import { Assets, Text, TextStyle } from 'pixi.js'
import { getAppScreen, Layer } from './application'
import { EventHub, events } from './events'

const paths = {
    sprites : './src/images/',
    sounds : './src/sounds/',
    music : './src/music/',
    fonts : './src/fonts/',
}

export const sprites = {
    stars: 'stars_150x150px_9frames.json',
    bg: 'bright_wood_800x800px.jpg',
    balls: 'balls_150x150px_90frames.json',
    board: 'board_1416x1416px.png',
    lock: 'lock_116x126px.png',
}
const spritesNumber = Object.keys(sprites).length
for (let sprite in sprites) sprites[sprite] = paths.sprites + sprites[sprite]

export const sounds = {
    clear: 'se_clear.mp3',
    click: 'se_click.mp3',
    false: 'se_false.mp3',
    help: 'se_help.mp3',
    lose: 'se_lose.mp3',
    slide: 'se_slide.mp3',
    sphere: 'se_sphere.mp3',
    start: 'se_start.mp3',
    true: 'se_true.mp3',
}
const soundsNumber = Object.keys(sounds).length
for (let se in sounds) sounds[se] = paths.sounds + sounds[se]

export const music = {
    bgm1: 'bgm_1.mp3',
    bgm2: 'bgm_2.mp3',
}
for (let bgm in music) music[bgm] = paths.music + music[bgm]

export const fonts = {
    light: 'RobotoLight.ttf',
    black: 'RobotoBlack.ttf',
}
for (let font in fonts) fonts[font] = paths.fonts + fonts[font]

const loadingTextStyle = new TextStyle({
    fontFamily: fonts.light,
    fontSize: 32,
    fill: ['#000000', '#777777', '#000000'],

    dropShadow: true,
    dropShadowColor: '#ffffff',
    dropShadowBlur: 4,
    dropShadowAngle: 0,
    dropShadowDistance: 0,
})
const loadingText = new Text('0 %', loadingTextStyle)
loadingText.anchor.set(0.5)
const resizeLoadingText = (appScreen) => {
    loadingText.position.x = appScreen.centerX
    loadingText.position.y = appScreen.centerY
}
resizeLoadingText( getAppScreen() )
const loadingLayer = new Layer(loadingText)
EventHub.on( events.screenResize, resizeLoadingText )

export function uploadAssets( loadingDoneCallback ) {
    const assetsNumber = spritesNumber + soundsNumber
    let loadedAssets = 0
    let progressPerAsset = 100 / assetsNumber

    const loading = () => {
        loadedAssets++
        loadingText.text = (progressPerAsset * loadedAssets).toFixed() + ' %'
        if (loadedAssets === assetsNumber) {
            EventHub.off( events.screenResize, resizeLoadingText )
            loadingLayer.removeLayer()
            loadingDoneCallback()
        }
    }

    for (let sprite in sprites) {
        Assets.add( {alias: sprite, src: sprites[sprite]} )
        Assets.load( sprite ).then(data => {
            sprites[sprite] = data
            loading()
        })
    }

    for (let se in sounds) {
        Assets.add( {alias: se, src: sounds[se]} )
        Assets.load( se ).then(data => {
            sounds[se] = data
            loading()
        })
    }
}