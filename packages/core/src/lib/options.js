
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

export function themeView(view) {
    return theme => ({...theme, view});
}
