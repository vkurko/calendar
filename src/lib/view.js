
export function createView(view, _activeRange) {
    return {
        type: view,
        title: undefined,
        activeStart: _activeRange.start,
        activeEnd: _activeRange.end,
        currentStart: undefined,
        currentEnd: undefined,
        calendar: undefined
    };
}