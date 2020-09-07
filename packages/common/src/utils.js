export function assign(...args) {
    return Object.assign(...args);
}

export function hasYScroll(el) {
    // return el.scrollHeight > el.clientHeight;
    return el.offsetWidth - el.clientWidth - el.clientLeft*2 > 0;  // ie11 (consider border right == border left)
}

export function action(node, content) {
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
