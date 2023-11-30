import { Assets } from 'pixi.js'
import { getLoadingBar, removeLoadingBar } from './loadingBar'

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
    board: 'game_board_1480x1480px.png',
    pointer: 'pointer_220x220px.png',
    lock: 'lock_116x126px.png',
    keys: 'keys_240x240px.png',
    effectYellow: 'effect_yellow_528x528px.png',
    effectPurple: 'effect_purple_528x528px.png',
    smoke: 'smoke_192x192px_25frames.json',
    disappearance: 'disappearance_128x128px_20frames.json',
    destroyer: 'destroyer_240x240px.png',
    logo: '5balls_876x568px.png',
    mars: 'mars_game_456x137px.png',
    buttons: 'buttons.json',
    social: 'social_icons_150x150px.json',
    flowerTop1: 'flower_116x67px.png',
    flowerTop2: 'flower_117x104px.png',
    flowerBottom1: 'flower_100x103px.png',
    flowerBottom2: 'flower_115x108px.png',
}
const spritesNumber = Object.keys(sprites).length
for (let sprite in sprites) sprites[sprite] = paths.sprites + sprites[sprite]

export const sounds = {
    await: 'se_await.mp3',
    bell: 'se_bell.mp3',
    bonus: 'se_bonus.mp3',
    out: 'se_out.mp3',
    clear1: 'se_clear_line_1.mp3',
    clear2: 'se_clear_line_2.mp3',
    clear3: 'se_clear_line_3.mp3',
    clear4: 'se_clear_line_4.mp3',
    clear5: 'se_clear_line_5.mp3',
    clear6: 'se_clear_line_6.mp3',
    slash: 'se_slash.mp3',
    melody: 'se_melody.mp3',
    start: 'se_start.mp3',
    unlock: 'se_unlock.mp3',
    closed: 'se_closed.mp3',
    whips: 'se_whips.mp3',
    swipe: 'se_swipe.mp3',
    wooden: 'se_wooden.mp3',
}
const soundsNumber = Object.keys(sounds).length
for (let se in sounds) sounds[se] = paths.sounds + sounds[se]

export const music = {
    bgm0: 'bgm_0.mp3',
    bgm1: 'bgm_1.mp3',
    bgm2: 'bgm_2.mp3',
}
for (let bgm in music) music[bgm] = paths.music + music[bgm]

export const fonts = {
    light: 'MontserratAlternates-Light.ttf',
    regular: 'MontserratAlternates-Regular.ttf',
    semiBold: 'MontserratAlternates-SemiBold.ttf',
    bold: 'MontserratAlternates-Bold.ttf',
}
for (let font in fonts) fonts[font] = paths.fonts + fonts[font]

///////////////////////////////////////////////////////////////////

export function uploadAssets( loadingDoneCallback ) {
    const assetsNumber = spritesNumber + soundsNumber
    let loadedAssets = 0
    let progressPerAsset = 100 / assetsNumber

    const loadingBar = getLoadingBar()

    const loading = () => {
        loadedAssets++
        loadingBar.update(progressPerAsset * loadedAssets)
        if (loadedAssets === assetsNumber) {
            removeLoadingBar()
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