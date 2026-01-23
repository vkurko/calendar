import {hasPayload} from './payload.js';

export function createElement(tag, className, content, attrs = []) {
    let el = document.createElement(tag);
    el.className = className;
    if (typeof content == 'string') {
        el.innerText = content;
    } else if (content.domNodes) {
        el.replaceChildren(...content.domNodes);
    } else if (content.html) {
        el.innerHTML = content.html;
    }
    for (let attr of attrs) {
        el.setAttribute(...attr);
    }
    return el;
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
    return rect(el).height;
}

export function getElementWithPayload(x, y, root = document, processed = []) {
    processed.push(root);
    for (let el of root.elementsFromPoint(x, y)) {
        if (hasPayload(el)) {
            return el;
        }
        /** @see https://github.com/vkurko/calendar/issues/142 */
        if (el.shadowRoot && !processed.includes(el.shadowRoot)) {
            let shadowEl = getElementWithPayload(x, y, el.shadowRoot, processed);
            if (shadowEl) {
                return shadowEl;
            }
        }
    }
    return null;
}

export function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}

export function stopPropagation(fn, _this = undefined) {
    return function (jsEvent) {
        jsEvent.stopPropagation();
        if (fn) {
            fn.call(_this, jsEvent);
        }
    };
}
