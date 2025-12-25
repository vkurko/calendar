import {handleScroll, setIClasses} from './effects.js';

export default class AuxState {
    constructor(mainState) {
        this.#setupEffects(mainState);
    }

    #setupEffects(mainState) {
        $effect.pre(setIClasses(mainState));
        $effect(handleScroll(mainState));
    }
}
