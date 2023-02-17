export function assign(...args) {
    return Object.assign(...args);
}

export function isObject(test) {
    return typeof test === 'object' && test !== null;
}

export function symbol() {
    return Symbol('ec');
}
