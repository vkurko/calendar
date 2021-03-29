
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