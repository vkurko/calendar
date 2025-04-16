<script>
    import './styles/index.scss';
    import {setContext, untrack} from 'svelte';
    import {get} from 'svelte/store';
    import {diff} from './storage/options.js';
    import State from './storage/state.js';
    import Toolbar from './Toolbar.svelte';
    import Auxiliary from './Auxiliary.svelte';
    import {
        assign, createEvents, getElementWithPayload, getPayload, listView, nextDate,
        prevDate, toEventWithLocalDates, toLocalDate, toViewWithLocalDates
    } from '#lib';

    let {plugins = [], options = {}} = $props();

    let state = new State(plugins, options);
    setContext('state', state);

    let {
        _viewComponent, _interaction, _iClass, _events, _scrollable,
        date, duration, hiddenDays, height, theme, view
    } = state;

    // Reactively update options that did change
    let prevOptions = {...options};
    $effect(() => {
        for (let [name, value] of diff(options, prevOptions)) {
            untrack(() => {
                setOption(name, value);
            });
        }
        assign(prevOptions, options);
    });

    export function setOption(name, value) {
        state._set(name, value);
        return this;
    }

    export function getOption(name) {
        let value = state._get(name);
        return value instanceof Date ? toLocalDate(value) : value;
    }

    export function refetchEvents() {
        state._fetchedRange.set({start: undefined, end: undefined});
        return this;
    }

    export function getEvents() {
        return $_events.map(toEventWithLocalDates);
    }

    export function getEventById(id) {
        for (let event of $_events) {
            if (event.id == id) {
                return toEventWithLocalDates(event);
            }
        }
        return null;
    }

    export function addEvent(event) {
        event = createEvents([event])[0];
        $_events.push(event);
        $_events = $_events;
        return toEventWithLocalDates(event);
    }

    export function updateEvent(event) {
        for (let e of $_events) {
            if (e.id == event.id) {
                event = createEvents([event])[0];
                assign(e, event);
                $_events = $_events;
                return toEventWithLocalDates(event);
            }
        }
        return null;
    }

    export function removeEventById(id) {
        let idx = $_events.findIndex(event => event.id == id);
        if (idx >= 0) {
            $_events.splice(idx, 1);
            $_events = $_events;
        }
        return this;
    }

    export function getView() {
        return toViewWithLocalDates(get(state._view));
    }

    export function unselect() {
        $_interaction.action?.unselect();
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
        $date = nextDate($date, $duration);
        return this;
    }

    export function prev() {
        $date = prevDate($date, $duration, $hiddenDays);
        return this;
    }

    let View = $derived($_viewComponent);
</script>

<div
    class="{$theme.calendar} {$theme.view}{$_scrollable ? ' ' + $theme.withScroll : ''}{$_iClass ? ' ' + $theme[$_iClass] : ''}"
    style:height={$height}
    role="{listView($view) ? 'list' : 'table'}"
>
    <Toolbar/>
    <View/>
</div>
<Auxiliary/>
