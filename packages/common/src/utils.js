export function assign(...args) {
    return Object.assign(...args);
}

export function hasYScroll(el) {
    return el.scrollHeight > el.clientHeight;
}

export function rect(el) {
    return el.getBoundingClientRect();
}

export function ancestor(el, up) {
    while (up--) {
        el = el.parentElement;
    }
    return el;
}

export function height(el) {
    return el.offsetHeight;
}

let ignoreProp = Symbol('ec');
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

export function isObject(test) {
    return typeof test === 'object' && test !== null;
}

export function createElement(tag, className, html, text) {
    let el = document.createElement(tag);
    el.className = className;
    if (html) {
        el.innerHTML = html;
    } else if (text) {
        el.innerText = text;
    }
    return el;
}
