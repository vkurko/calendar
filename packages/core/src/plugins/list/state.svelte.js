import {intl} from '#lib';

export default class ViewState {
    constructor(mainState) {
        this.intlListDay = $derived.by(intl(mainState, 'listDayFormat'));
        this.intlListDaySide = $derived.by(intl(mainState, 'listDaySideFormat'));
    }
}
