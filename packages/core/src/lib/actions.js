
export function setContent(node, content) {
    let actions = {
        update(content) {
            if (typeof content == 'string') {
                node.innerText = content;
            } else if (content?.domNodes) {
                node.replaceChildren(...content.domNodes);
            } else if (content?.html) {
                node.innerHTML = content.html;
            }
        }
    };
    actions.update(content);

    return actions;
}

/** Dispatch event occurred outside of node */
export function outsideEvent(node, type) {

    const handlePointerDown = jsEvent => {
        if (node && !node.contains(jsEvent.target)) {
            node.dispatchEvent(
                new CustomEvent(type + 'outside', {detail: {jsEvent}})
            );
        }
    };

    document.addEventListener(type, handlePointerDown, true);

    return {
        destroy() {
            document.removeEventListener(type, handlePointerDown, true);
        }
    };
}

export function observeResize(node, callback) {
    let resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            callback(entry);
        }
    });
    resizeObserver.observe(node);

    return {
        destroy() {
            resizeObserver.unobserve(node);
        }
    };
}
