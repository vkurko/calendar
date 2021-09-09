
/** Dispatch event on click outside of node */
export function clickOutside(node) {

    const handleClick = clickEvent => {
        if (node && !node.contains(clickEvent.target)) {
            node.dispatchEvent(
                new CustomEvent('clickoutside', {detail: {clickEvent}})
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