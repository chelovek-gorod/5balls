import { utils } from "pixi.js";

export const EventHub = new utils.EventEmitter()

export const events = {
    screenResize: 'screenResize',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}

/*
USAGE

Init:
anyFunction( data )

Subscribe:
EventHub.on( events.eventKey, ( event ) => {
    // event actions 
})

*/

