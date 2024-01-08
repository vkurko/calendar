<script>
    import './styles/index.scss';
    import {setContext, beforeUpdate, afterUpdate} from 'svelte';
    import {destroy_component, get_current_component} from 'svelte/internal';
    import {get} from 'svelte/store';
    import {diff} from './storage/options';
    import State from './storage/state';
    import Toolbar from './Toolbar.svelte';
    import Auxiliary from './Auxiliary.svelte';
    import {
        assign,
        createEvents,
        toEventWithLocalDates,
        toViewWithLocalDates,
        toLocalDate,
        getElementWithPayload,
        getPayload,
        flushDebounce,
        hasYScroll,
        listView,
        task
    } from './lib.js';

    export let plugins = [];
    export let options = {};

    let component = get_current_component();

    let state = new State(plugins, options);
    setContext('state', state);

    let {_viewComponent, _bodyEl, _interaction, _iClass, _events, _queue, _queue2, _tasks, _scrollable, height, theme, view} = state;

    // Reactively update options that did change
    let prevOptions = {...options};
    $: for (let [name, value] of diff(options, prevOptions)) {
        setOption(name, value);
    }

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
        $_events.push(createEvents([event])[0]);
        $_events = $_events;
        return this;
    }

    export function updateEvent(event) {
        for (let e of $_events) {
            if (e.id == event.id) {
                assign(e, createEvents([event])[0]);
                $_events = $_events;
                break;
            }
        }
        return this;
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
        if ($_interaction.action) {
            $_interaction.action.unselect();
        }
        return this;
    }

    export function dateFromPoint(x, y) {
        let dayEl = getElementWithPayload(x, y);
        return dayEl ? getPayload(dayEl)(y) : null;
    }

    export function destroy() {
        destroy_component(component, true);
    }

    beforeUpdate(() => {
        flushDebounce($_queue);
    });

    afterUpdate(() => {
        flushDebounce($_queue2);
        task(recheckScrollable, null, _tasks);
    });

    function recheckScrollable() {
        if ($_bodyEl) {
            $_scrollable = hasYScroll($_bodyEl);
        }
    }
</script>

<div
    class="{$theme.calendar} {$theme.view}{$_scrollable ? ' ' + $theme.withScroll : ''}{$_iClass ? ' ' + $theme[$_iClass] : ''}"
    style:height={$height}
    role="{listView($view) ? 'list' : 'table'}"
>
    <Toolbar/>
    <svelte:component this={$_viewComponent}/>
</div>
<Auxiliary/>

<svelte:window on:resize={recheckScrollable}/>
