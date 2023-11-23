import { Assets } from 'pixi.js'
import { fonts, uploadAssets } from './loader'
import { startGame } from './game'
import { board } from './board'

// preload fonts
Assets.addBundle('fonts', fonts)
Assets.loadBundle('fonts').then( () => uploadAssets( startGame ) )