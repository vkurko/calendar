
export function keyEnter(fn) {
    return function (e) {
        return e.key === 'Enter' || e.key === ' ' ? fn.call(this, e) : undefined;
    };
}

export function btnTextDay(text) {
    return btnText(text, 'day');
}

export function btnTextWeek(text) {
    return btnText(text, 'week');
}

export function btnTextMonth(text) {
    return btnText(text, 'month');
}

export function btnTextYear(text) {
    return btnText(text, 'year');
}

function btnText(text, period) {
    return {
        ...text,
        next: 'Next ' + period,
        prev: 'Previous ' + period
    };
}
