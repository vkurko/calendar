import {SvelteMap} from 'svelte/reactivity';
import {createDate, identity, intl, intlRange, setMidnight} from '#lib';
import {optionsState} from './options.svelte.js';
import {
    createLoadingInvoker, loadEvents, loadResources, runDatesSet, runEventAllUpdated, runViewDidMount, setNowAndToday
} from './effects.js';
import {activeRange, currentRange, filteredEvents, view, viewDates, viewTitle} from './derived.js';
import {arrayProxy} from './proxy.svelte.js';

export default class State {

    #setOption;

    constructor(plugins, options) {
        // Create options state
        let {state, setOption, initEffects} = optionsState(this, plugins, options);
        this.options = state;
        this.#setOption = setOption;

        // Create other states
        this.auxComponents = $state([]);
        this.currentRange = $derived.by(currentRange(this));
        this.activeRange = $derived.by(activeRange(this));
        this.fetchedRange = $state({events: {}, resources: {}});
        this.events = $state.raw(arrayProxy([]));
        this.filteredEvents = $derived.by(filteredEvents(this));
        this.mainEl = $state();
        this.now = $state(createDate());
        this.resources = $state.raw(arrayProxy([]));
        this.today = $state(setMidnight(createDate()));
        this.intlEventTime = $derived.by(intlRange(this, 'eventTimeFormat'));
        this.intlDayHeader = $derived.by(intl(this, 'dayHeaderFormat'));
        this.intlDayHeaderAL = $derived.by(intl(this, 'dayHeaderAriaLabelFormat'));
        this.intlTitle = $derived.by(intlRange(this, 'titleFormat'));
        this.viewDates = $derived.by(viewDates(this));
        this.viewTitle = $derived.by(viewTitle(this));
        this.view = $derived.by(view(this));
        this.viewComponent = $state();
        this.extensions = $state({});
        this.features = $state([]);
        // Interaction
        this.interaction = $state({});
        this.iEvents = new SvelteMap();
        this.iClasses = $state(identity);
        this.iClass = $state();

        // Let plugins init their states
        for (let plugin of plugins) {
            plugin.initState?.(this);
        }

        initEffects();
        this.#initEffects();
    }

    #initEffects() {
        let loading = createLoadingInvoker(this.options);
        $effect.pre(setNowAndToday(this));
        $effect(loadEvents(this, loading));
        $effect(loadResources(this, loading));
        $effect(runDatesSet(this));
        $effect(runEventAllUpdated(this));
        $effect(runViewDidMount(this));
    }

    setViewComponent(component) {
        this.extensions = {};
        this.features = [];
        this.viewComponent = component(this);
    }

    setOption(name, value, parsed = true) {
        this.#setOption(name, value, parsed);
    }
}
