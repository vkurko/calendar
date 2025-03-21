
export function keyEnter(fn) {
    return function (e) {
        return e.key === 'Enter' || e.key === ' ' && !e.preventDefault()  // prevent page scroll down
            ? fn.call(this, e)
            : undefined;
    };
}
