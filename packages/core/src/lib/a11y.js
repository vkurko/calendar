
export function keyEnter(fn) {
    return function (e) {
        return e.key === 'Enter' || e.key === ' ' ? fn.call(this, e) : undefined;
    };
}
