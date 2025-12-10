
export function keyEnter(fn, _this = undefined) {
    return function (e) {
        return e.key === 'Enter' || e.key === ' ' && !e.preventDefault()  // prevent page scroll down
            ? fn.call(_this, e)
            : undefined;
    };
}
