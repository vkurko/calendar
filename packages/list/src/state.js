import {intl} from '@event-calendar/common';

export default class {
    constructor(state) {
        this._intlListDayFormat = intl(state.locale, state.listDayFormat);
        this._intlListDaySideFormat = intl(state.locale, state.listDaySideFormat);
    }
}