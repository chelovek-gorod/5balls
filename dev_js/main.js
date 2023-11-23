import { Assets } from 'pixi.js'
import { fonts, uploadAssets } from './loader'
import { initFontStyles } from './fonts'
import { startGame } from './game'

// preload fonts
Assets.addBundle('fonts', fonts)
Assets.loadBundle('fonts').then( fontsData => {
    // update font values be font family
    for(let key in fontsData) fonts[key] = fontsData[key].family
    initFontStyles()
    uploadAssets( startGame )
})