
export function contentFrom(content) {
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

export function resizeObserver(callback) {
    return el => {
        let observer = new ResizeObserver(entries => {
            for (let entry of entries) {
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
