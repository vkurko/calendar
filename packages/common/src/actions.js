
export function setContent(node, content) {
    let actions = {
        update(content) {
            while (node.firstChild) {
                node.removeChild(node.lastChild);
            }
            if (content.domNodes) {
                for (let child of content.domNodes) {
                    node.appendChild(child);
                }
            } else if (content.html) {
                node.innerHTML = content.html;
            }
        }
    };
    actions.update(content);

    return actions;
}

/** Dispatch event on click outside of node */
export function clickOutside(node) {

    const handleClick = jsEvent => {
        if (node && !node.contains(jsEvent.target)) {
            node.dispatchEvent(
                new CustomEvent('clickoutside', {detail: {jsEvent}})
            );
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}
