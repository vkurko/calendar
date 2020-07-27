
export function createView(view, _viewTitle, _activeRange) {
    return {
        type: view,
        title: _viewTitle,
        activeStart: _activeRange.start,
        activeEnd: _activeRange.end,
        currentStart: undefined,
        currentEnd: undefined,
        calendar: undefined
    };
}