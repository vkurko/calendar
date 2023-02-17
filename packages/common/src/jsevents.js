import {symbol} from './utils.js';

let ignoreProp = symbol();
export function ignore(jsEvent) {
    jsEvent[ignoreProp] = true;
}

export function maybeIgnore(fn) {
    return jsEvent => {
        if (!jsEvent[ignoreProp]) {
            fn && fn(jsEvent);
            // Make upper listeners ignore the event
            ignore(jsEvent);
        }
    };
}
