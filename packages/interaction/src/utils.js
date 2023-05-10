import {min, max} from '@event-calendar/common';

let busy = false;
export function animate(fn) {
    if (!busy) {
        busy = true;
        window.requestAnimationFrame(() => {
            fn();
            busy = false;
        });
    }
}

export function limit(value, minLimit, maxLimit) {
    return max(minLimit, min(maxLimit, value));
}
