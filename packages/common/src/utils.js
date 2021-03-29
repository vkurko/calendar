export function assign(...args) {
    return Object.assign(...args);
}

export function hasYScroll(el) {
    // return el.scrollHeight > el.clientHeight;
    return el.offsetWidth - el.clientWidth - el.clientLeft*2 > 0;  // ie11 (consider border right == border left)
}

export function rect(el) {
    return el.getBoundingClientRect();
}