import {symbol} from './utils.js';

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
    return rect(el).height;
}

let payloadProp = symbol();
export function setPayload(el, payload) {
    el[payloadProp] = payload;
}

export function hasPayload(el) {
    return !!el?.[payloadProp];
}

export function getPayload(el) {
    return el[payloadProp];
}

export function getElementWithPayload(x, y) {
    for (let el of document.elementsFromPoint(x, y)) {
        if (hasPayload(el)) {
            return el;
        }
    }
    return null;
}
