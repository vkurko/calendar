import {assign} from './utils.js';
import {toLocalDate} from './date.js';

export function createView(view, _viewTitle, _currentRange, _activeRange) {
    return {
        type: view,
        title: _viewTitle,
        currentStart: _currentRange.start,
        currentEnd: _currentRange.end,
        activeStart: _activeRange.start,
        activeEnd: _activeRange.end,
        calendar: undefined
    };
}

export function toViewWithLocalDates(view) {
    view = assign({}, view);
    view.currentStart = toLocalDate(view.currentStart);
    view.currentEnd = toLocalDate(view.currentEnd);
    view.activeStart = toLocalDate(view.activeStart);
    view.activeEnd = toLocalDate(view.activeEnd);

    return view;
}

export function listView(view) {
    return view.startsWith('list');
}
