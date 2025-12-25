export function assign(...args) {
    return Object.assign(...args);
}

export function keys(object) {
    return Object.keys(object);
}

export function entries(object) {
    return Object.entries(object);
}

export function hasOwn(object, property) {
    return Object.hasOwn(object, property);
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

export function stopPropagation(fn, _this = undefined) {
    return function (event) {
        event.stopPropagation();
        if (fn) {
            fn.call(_this, event);
        }
    };
}

export function isRtl() {
    return window.getComputedStyle(document.documentElement).direction === 'rtl';
}
