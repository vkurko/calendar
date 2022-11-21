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

export function ancestor(el, up) {
    while (up--) {
        el = el.parentElement;
    }
    return el;
}

export function height(el) {
    return el.offsetHeight;
}

export function maybeIgnore(fn) {
    return jsEvent => {
        if (!jsEvent.ecIgnore) {
            fn && fn(jsEvent);
            // Make upper listeners ignore the event
            jsEvent.ecIgnore = true;
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
