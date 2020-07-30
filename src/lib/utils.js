export function hasYScroll(el) {
    // return el.scrollHeight > el.clientHeight;
    return el.offsetWidth - el.clientWidth - el.clientLeft*2 > 0;  // ie11 (consider border right == border left)
}