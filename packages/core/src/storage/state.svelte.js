import {SvelteMap} from 'svelte/reactivity';
import {createDate, identity, intl, intlRange, setMidnight} from '#lib';
import {optionsState} from './options.js';
import {
    createLoadingInvoker, loadEvents, loadResources, runDatesSet, runEventAllUpdated, runViewDidMount, setNowAndToday,
    switchView
} from './effects.js';
import {activeRange, currentRange, filteredEvents, view, viewDates, viewTitle} from './derived.js';
import {arrayProxy} from './proxy.svelte.js';

export default class State {

    options;
    setOption;
    setViewOptions;

    constructor(plugins, options) {
        // Create options state
        ([this.options, this.setOption, this.setViewOptions] = optionsState(plugins, options));

        // Create other states
        this.auxComponents = $state([]);
        this.currentRange = $derived.by(currentRange(this));
        this.activeRange = $derived.by(activeRange(this));
        this.fetchedRange = $state({events: {}, resources: {}});
        this.events = $state.raw(arrayProxy(this.options.events));
        this.filteredEvents = $derived.by(filteredEvents(this));
        this.mainEl = $state();
        this.now = $state(createDate());
        this.resources = $state.raw(arrayProxy(this.options.resources));
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
        this.snippets = $state({});
        // Interaction
        this.interaction = $state({});
        this.iEvents = new SvelteMap();
        this.iClasses = $state(identity);
        this.iClass = $state();

        // Let plugins init their states
        for (let plugin of plugins) {
            plugin.initState?.(this);
        }

        this.#initEffects();
    }

    #initEffects() {
        let loading = createLoadingInvoker(this);
        $effect.pre(switchView(this));
        $effect.pre(setNowAndToday(this));
        $effect(loadEvents(this, loading));
        $effect(loadResources(this, loading));
        $effect(runDatesSet(this));
        $effect(runEventAllUpdated(this));
        $effect(runViewDidMount(this));
    }
}
