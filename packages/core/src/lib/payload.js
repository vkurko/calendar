import {symbol} from './utils.js';

let payloadProp = symbol();
export function setPayload(obj, payload) {
    obj[payloadProp] = payload;
}

export function hasPayload(obj) {
    return !!obj?.[payloadProp];
}

export function getPayload(obj) {
    return obj[payloadProp];
}

export function removePayload(obj) {
    delete obj?.[payloadProp];
}
