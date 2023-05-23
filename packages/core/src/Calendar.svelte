<script>
    import './index.scss';
    import {setContext, beforeUpdate} from 'svelte';
    import {destroy_component, get_current_component} from 'svelte/internal';
    import {get} from 'svelte/store';
    import {diff} from './storage/options';
    import State from './storage/state';
    import Toolbar from './Toolbar.svelte';
    import Auxiliary from './Auxiliary.svelte';
    import {
        assign,
        toEventWithLocalDates,
        toViewWithLocalDates,
        toLocalDate,
        getElementWithPayload,
        getPayload,
        flushDebounce,
        hasYScroll
    } from './lib.js';

    export let plugins = [];
    export let options = {};

    let component = get_current_component();

    let state = new State(plugins, options);
    setContext('state', state);

    let {_viewComponent, _viewClass, _bodyEl, _interaction, _iClass, _events, _queue, _scrollable,
        events, eventSources, height, theme} = state;

    // Reactively update options that did change
    $: for (let [name, value] of diff(options)) {
        setOption(name, value);
    }

    export function setOption(name, value) {
        if (state.hasOwnProperty(name)) {
            if (state[name].parse) {
                value = state[name].parse(value);
            }
            state[name].set(value);
        }
        return this;
    }

    export function getOption(name) {
        let value = state.hasOwnProperty(name) ? get(state[name]) : undefined;
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
        updateEvents(events => events.concat(state.events.parse([event])));
        return this;
    }

    export function updateEvent(event) {
        updateEvents(events => {
            for (let e of events) {
                if (e.id == event.id) {
                    assign(e, state.events.parse([event])[0]);
                    break;
                }
            }
            return events;
        });
        return this;
    }

    export function removeEventById(id) {
        updateEvents(events => events.filter(event => event.id != id));
        return this;
    }

    export function getView() {
        return toViewWithLocalDates(state._view.get());
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

    function updateEvents(func) {
        $_events = func($_events);
        if (!$eventSources.length) {
            $events = $_events;
        }
    }

    beforeUpdate(() => {
        flushDebounce($_queue);
        setTimeout(recheckScrollable)
    });

    function recheckScrollable() {
        if ($_bodyEl) {
            $_scrollable = hasYScroll($_bodyEl);
        }
    }
</script>

<div
    class="{$theme.calendar}{$_viewClass ? ' ' + $theme[$_viewClass] : ''}{$_scrollable ? ' ' + $theme.withScroll : ''}{$_iClass ? ' ' + $theme[$_iClass] : ''}"
    style="height: {$height}"
>
    <Toolbar/>
    <svelte:component this={$_viewComponent}/>
</div>
<Auxiliary/>

<svelte:window on:resize={recheckScrollable}/>
