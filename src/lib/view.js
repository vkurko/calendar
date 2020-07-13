
export function createView(view, _viewDates) {
    return {
        type: view,
        title: undefined,
        activeStart: _viewDates[0],
        activeEnd: _viewDates[_viewDates.length - 1],
        currentStart: undefined,
        currentEnd: undefined,
        calendar: undefined
    };
}