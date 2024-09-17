export function assign(...args) {
    return Object.assign(...args);
}

export function keys(object) {
    return Object.keys(object);
}

export function floor(value) {
    return Math.floor(value);
}

export function ceil(value) {
    return Math.ceil(value);
}

export function min(...args) {
    return Math.min(...args);
}

export function max(...args) {
    return Math.max(...args);
}

export function symbol() {
    return Symbol('ec');
}

export function isArray(value) {
    return Array.isArray(value);
}

/** @param {Array<() => void>} arr */
export function run_all(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i]();
	}
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
export function is_function(thing) {
	return typeof thing === 'function';
}

export const noop = () => {};


/**
 * Fires the handler once immediately (unless corresponding arg is set to `false`),
 * then listens to the given events until the render effect context is destroyed
 * @param {EventTarget} target
 * @param {Array<string>} events
 * @param {(event?: Event) => void} handler
 * @param {any} call_handler_immediately
 */
export function listen(target, events, handler, call_handler_immediately = true) {
	if (call_handler_immediately) {
		handler();
	}

	for (var name of events) {
		target.addEventListener(name, handler);
	}

	teardown(() => {
		for (var name of events) {
			target.removeEventListener(name, handler);
		}
	});
}

