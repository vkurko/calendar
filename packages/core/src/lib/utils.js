export function assign(...args) {
    return Object.assign(...args);
}

export function keys(object) {
    return Object.keys(object);
}

export function entries(object) {
    return Object.entries(object);
}

export function fromEntries(array) {
    return Object.fromEntries(array);
}

export function floor(value) {
    return Math.floor(value);
}

export function ceil(value) {
    return Math.ceil(value);
}

export function min(...args) {
    return Math.min(...args);
}

export function max(...args) {
    return Math.max(...args);
}

export function symbol() {
    return Symbol('ec');
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function run(fn) {
    return fn();
}

export function runAll(fns) {
    fns.forEach(run);
}

export function noop() {}

export const identity = (x) => x;

export function stopPropagation(fn) {
    return function (event) {
        event.stopPropagation();
        if (fn) {
            fn.call(this, event);
        }
    };
}
