
export function traverseTimeGrid(el) {
    let dayEl = ancestor(el, 2);
    let colEl = child(ancestor(dayEl, 1), 1);
    let bodyEl = ancestor(dayEl, 3);
    let col = pos(dayEl) - 1;

    return [colEl, bodyEl, col];
}

export function traverseResourceTimeGrid(el, datesAboveResources) {
    let dayEl = ancestor(el, 2);
    let colEl = child(child(ancestor(dayEl, 2), 1), 0);
    let resourceEl = ancestor(dayEl, 1);
    let bodyEl = ancestor(resourceEl, 3);
    let col = pos(dayEl);
    let resourceCol = pos(resourceEl) - 1;

    return datesAboveResources ? [colEl, bodyEl, resourceCol, col] : [colEl, bodyEl, col, resourceCol];
}

export function traverseDayGrid(el) {
    let dayEl = ancestor(el, 2);
    let daysEl = ancestor(dayEl, 1);
    let contentEl = ancestor(daysEl, 1);
    let colEl = child(child(contentEl, 0), 0);
    let bodyEl = ancestor(contentEl, 1);
    let col = pos(dayEl);
    let row = pos(daysEl);

    return [colEl, bodyEl, col, row, contentEl.children];
}

function ancestor(el, up) {
    while (up--) {
        el = el.parentElement;
    }
    return el;
}

function child(el, pos) {
    return el.children[pos];
}

function pos(el) {
    let result = 0;
    while ((el = el.previousElementSibling)) {
        ++result;
    }
    return result;
}

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

export function limit(value, max) {
    return Math.max(0, Math.min(max, value));
}

export function floor(value) {
    return Math.floor(value);
}