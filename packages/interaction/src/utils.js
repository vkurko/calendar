
export function traverseTimeGrid(el) {
    let day = ancestor(el, 2);
    let body = ancestor(day, 3);
    let dayCol = pos(day) - 1;

    return [day, body, dayCol];
}

export function traverseResourceTimeGrid(el) {
    let day = ancestor(el, 2);
    let resource = ancestor(day, 1);
    let body = ancestor(resource, 3);
    let dayCol = pos(day);
    let resourceCol = pos(resource) - 1;

    return [day, body, dayCol, resourceCol];
}

export function traverseDayGrid(el) {
    let day = ancestor(el, 2);
    let days = ancestor(day, 1);
    let content = ancestor(days, 1);
    let body = ancestor(content, 1);
    let dayCol = pos(day);
    let dayRow = pos(days);

    return [day, body, dayCol, dayRow, content.children];
}

function ancestor(el, up) {
    while (up--) {
        el = el.parentElement;
    }
    return el;
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
