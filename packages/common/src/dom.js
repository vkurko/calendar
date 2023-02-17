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
    return el.offsetHeight;
}

let fnProp = symbol();
export function setFn(el, fn) {
    el[fnProp] = fn;
}

export function hasFn(el) {
    return !!el[fnProp];
}

export function runFn(el, ...args) {
    return el[fnProp](...args);
}
