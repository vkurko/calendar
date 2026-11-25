import {isFunction} from './utils.js';

export function contentFrom(content, snippet) {
    if (snippet) {
        // The content is rendered by the user snippet inside the element
        return null;
    }
    if (isFunction(content)) {
        // The content is rendered into the element by the function itself
        return el => {
            let destroy = content(el);
            sizeObserver ??= new ResizeObserver(sizeChanged);
            sizeObserver.observe(el);
            return () => {
                sizeObserver.unobserve(el);
                if (isFunction(destroy)) {
                    destroy();
                }
            };
        };
    }
    return el => {
        if (typeof content == 'string') {
            el.innerText = content;
        } else if (content?.domNodes) {
            el.replaceChildren(...content.domNodes);
        } else if (content?.html) {
            el.innerHTML = content.html;
        }
    };
}

/**
 * The calendar does not know when the content rendered by a function changes its size later, so the height of the
 * elements with such content is observed. The listeners run in the next frame: changing the layout right in the
 * observer makes the browser report an error when that resizes other observed elements.
 */
let sizeObserver;
let sizes = new WeakMap();
let sizeListeners = new Set();
let sizeFrame;
function sizeChanged(entries) {
    for (let {target, contentRect: {height}} of entries) {
        if (sizes.get(target) !== height) {
            sizes.set(target, height);
            sizeFrame ??= requestAnimationFrame(() => {
                sizeFrame = undefined;
                for (let listener of sizeListeners) {
                    listener();
                }
            });
        }
    }
}

/** Run the callback when the content rendered by a function changes its height */
export function contentResized(callback) {
    return () => {
        sizeListeners.add(callback);

        return () => {
            sizeListeners.delete(callback);
        };
    };
}

/** Dispatch event occurred outside of node */
export function outsideEvent(type) {
    return el => {
        let listener = jsEvent => {
            if (el && !el.contains(jsEvent.target)) {
                el.dispatchEvent(
                    new CustomEvent(type + 'outside', {detail: {jsEvent}})
                );
            }
        };
        document.addEventListener(type, listener, true);

        return () => {
            document.removeEventListener(type, listener, true);
        };
    };
}

/**
 * @param callback
 * @param widthOnly  Skip the notifications where the width did not change. The event layout depends
 *                   on the height of the events, which in turn depends on the width, while the height
 *                   of the element itself is a result of the layout, not its input.
 */
export function resizeObserver(callback, widthOnly = false) {
    return el => {
        let width;
        let observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (widthOnly) {
                    let {inlineSize} = entry.contentBoxSize?.[0] ?? {inlineSize: entry.contentRect.width};
                    if (inlineSize === width) {
                        continue;
                    }
                    width = inlineSize;
                }
                callback(el, entry);
            }
        });
        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    };
}

export function intersectionObserver(callback, options) {
    return el => {
        let observer = new IntersectionObserver(entries => {
            for (let entry of entries) {
                callback(el, entry);
            }
        }, options);

        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    };
}
