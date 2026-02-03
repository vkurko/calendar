import {hasOwn} from '#lib';

/**
 * Array proxy that triggers the effect on any assignment to first-level elements or length property
 */
export function arrayProxy(array) {
    let counter = 0;
    let version = $state(counter);
    return proxy(
        array,
        () => version,
        () => true,
        () => version = ++counter
    );
}

/**
 * Object proxy that triggers the effect on changes to first-level properties
 */
export function objectProxy(object) {
    let counter = 0;
    let versions = $state({});
    return proxy(
        object,
        prop => versions[prop],
        (a, b) => a !== b,
        prop => versions[prop] = ++counter
    );
}

function proxy(target, setDependency, hasEffect, invokeEffect) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            if (hasOwn(target, prop)) {
                setDependency(prop);
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            let has = hasEffect(target[prop], value);
            Reflect.set(target, prop, value, receiver);
            if (has) {
                invokeEffect(prop);
            }
            return true;
        }
    });
}
