<script>
    import './styles/index.css';
    import {setContext, untrack} from 'svelte';
    import {
        assign, cloneDate, createEvents, getElementWithPayload, getPayload, isArray, isDate, isPlainObject, nextDate,
        prevDate, toEventWithLocalDates, toLocalDate, toViewWithLocalDates
    } from '#lib';
    import MainState from './storage/state.svelte.js';
    import {diff} from './storage/options.svelte.js';
    import Toolbar from './Toolbar.svelte';

    let {plugins = [], options = {}} = $props();

    // svelte-ignore state_referenced_locally
    let mainState = new MainState(plugins, options);
    setContext('state', mainState);

    let {
        auxComponents, features, events, interaction, iClass, view, viewComponent: View,
        options: {date, duration, height, hiddenDays, theme}
    } = $derived(mainState);

    // Reactively update options that did change
    // svelte-ignore state_referenced_locally
    let prevOptions = {...options};
    $effect.pre(() => {
        for (let [name, value] of diff(options, prevOptions)) {
            untrack(() => {
                setOption(name, value);
            });
        }
        assign(prevOptions, options);
    });

    export function setOption(name, value) {
        if (isPlainObject(value)) {
            value = {...value};
        }
        if (isArray(value)) {
            value = [...value];
        }
        mainState.setOption(name, value, false);
        return this;
    }

    export function getOption(name) {
        let value = mainState.options[name];
        return isDate(value) ? toLocalDate(value) : value;
    }

    export function refetchEvents() {
        mainState.fetchedRange = {start: undefined, end: undefined};
        return this;
    }

    export function getEvents() {
        return events.map(toEventWithLocalDates);
    }

    export function getEventById(id) {
        id = String(id);
        for (let event of events) {
            if (event.id === id) {
                return toEventWithLocalDates(event);
            }
        }
        return null;
    }

    export function addEvent(event) {
        event = createEvents([event])[0];
        events.push(event);
        mainState.events = [...events];
        return toEventWithLocalDates(event);
    }

    export function updateEvent(event) {
        let id = String(event.id);
        let idx = events.findIndex(event => event.id === id);
        if (idx >= 0) {
            event = createEvents([event])[0];
            events[idx] = event;
            mainState.events = [...events];
            return toEventWithLocalDates(event);
        }
        return null;
    }

    export function removeEventById(id) {
        id = String(id);
        let idx = events.findIndex(event => event.id === id);
        if (idx >= 0) {
            events.splice(idx, 1);
            mainState.events = [...events];
        }
        return this;
    }

    export function getView() {
        return toViewWithLocalDates(view);
    }

    export function unselect() {
        interaction.action?.unselect();
        return this;
    }

    export function dateFromPoint(x, y) {
        let dayEl = getElementWithPayload(x, y);
        if (dayEl) {
            let info = getPayload(dayEl)(x, y);
            info.date = toLocalDate(info.date);

            return info;
        }
        return null;
    }

    export function next() {
        mainState.setOption('date', nextDate(cloneDate(date), duration));
        return this;
    }

    export function prev() {
        mainState.setOption('date', prevDate(cloneDate(date), duration, hiddenDays));
        return this;
    }
</script>

<div
    class={[
        theme.calendar,
        theme.view,
        iClass && theme[iClass]
    ]}
    style:height
    role="{features.includes('list') ? 'list' : 'table'}"
>
    <Toolbar/>
    {#if View} <!-- temporary fix for https://github.com/sveltejs/kit/issues/15109 -->
        <View/>
    {/if}
    {#each auxComponents as AuxComponent}
        <AuxComponent/>
    {/each}
</div>
