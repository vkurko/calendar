export function assign(...args) {
    return Object.assign(...args);
}

export function floor(value) {
    return Math.floor(value);
}

export function min(...args) {
    return Math.min(...args);
}

export function max(...args) {
    return Math.max(...args);
}

export function isObject(test) {
    return typeof test === 'object' && test !== null;
}

export function symbol() {
    return Symbol('ec');
}
