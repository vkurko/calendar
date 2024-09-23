<script>
    import {afterUpdate, getContext, onMount} from 'svelte';
    import {
        createEventContent,
        createEventClasses,
        toEventWithLocalDates,
        toViewWithLocalDates,
        setContent,
        bgEvent,
        helperEvent,
        keyEnter,
        resourceBackgroundColor,
        resourceTextColor,
        task, height, DAY_IN_SECONDS, toSeconds,
        isFunction
    } from '@event-calendar/core';
    import {repositionEvent, getSlotTimeLimits} from './lib.js';

    export let date;
    export let chunk;
    export let dayChunks = [];
    export let longChunks = {};
    export let resource = undefined;

    let {displayEventEnd, eventAllUpdated, eventBackgroundColor, eventTextColor,eventColor, eventContent, eventClick,
        eventDidMount, eventClassNames, eventMouseEnter, eventMouseLeave, resources, slotDuration, slotWidth, theme,
        _view, _intlEventTime, _interaction, _iClasses, _dayTimeLimits, _tasks} = getContext('state');

    let el;
    let event;
    let display;
    let classes;
    let style;
    let content;
    let timeText;
    let onclick;
    let margin = helperEvent(chunk.event.display) ? 1 : 0;
    let width = 0;

    $: event = chunk.event;

    $: {
        display = event.display;

        // Style
        let step = toSeconds($slotDuration);
        if (step) {
            let start = (chunk.start - date) / 1000;
            let end = (chunk.end - date) / 1000;
            // Shift start
            let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, date);
            let offsetStart = toSeconds(slotTimeLimits.min);
            let offsetEnd = toSeconds(slotTimeLimits.max);
            start -= offsetStart;
            if (start < 0) {
                start = 0;
            }
            if (start > offsetEnd - offsetStart) {
                start = offsetEnd - offsetStart;
            }
            // Shift end
            let cut = 0;
            for (let i = 0; i < chunk.days; ++i) {
                let slotTimeLimits = getSlotTimeLimits($_dayTimeLimits, chunk.dates[i]);
                let offsetStart = toSeconds(slotTimeLimits.min);
                let offsetEnd = toSeconds(slotTimeLimits.max);
                let dayStart = DAY_IN_SECONDS * i;
                // Cut offsetEnd
                let dayEnd = dayStart + DAY_IN_SECONDS;
                if (dayEnd > end) {
                    dayEnd = end;
                }
                if (dayEnd > dayStart + offsetEnd) {
                    cut += dayEnd - dayStart - offsetEnd;
                }
                // Cut offsetStart
                let c = end - dayStart;
                if (c > offsetStart) {
                    c = offsetStart;
                }
                cut += c;
            }
            end -= cut;
            let left = start / step * $slotWidth;
            width = (end - start) / step * $slotWidth;
            style =
                `left:${left}px;` +
                `width:${width}px;`
            ;
        } else {
            // Month view
            width = chunk.days * 100;
            style =
                `width:${width}%;`
            ;
        }
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
        let marginTop = margin;
        if (event._margin) {
            // Force margin for helper events
            let [_margin, _resource] = event._margin;
            if (resource === _resource) {
                marginTop = _margin;
            }
        }
        style += `margin-top:${marginTop}px;`;
        if (bgColor) {
            style += `background-color:${bgColor};`;
        }
        if (txtColor) {
            style += `color:${txtColor};`;
        }
        style += event.styles.join(';');

        // Class
        classes = [
            bgEvent(display) ? $theme.bgEvent : $theme.event,
            ...$_iClasses([], event),
            ...createEventClasses($eventClassNames, event, $_view)
        ].join(' ');
    }

    // Content
    $: [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);

    onMount(() => {
        if (isFunction($eventDidMount)) {
            $eventDidMount({
                event: toEventWithLocalDates(event),
                timeText,
                el,
                view: toViewWithLocalDates($_view)
            });
        }
    });

    afterUpdate(() => {
        if (isFunction($eventAllUpdated) && !helperEvent(display)) {
            task(() => $eventAllUpdated({view: toViewWithLocalDates($_view)}), 'eau', _tasks);
        }
    });

    function createHandler(fn, display) {
        return !helperEvent(display) && isFunction(fn)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)})
            : undefined;
    }

    function createDragHandler(interaction, resize) {
        return interaction.action
            ? jsEvent => interaction.action.drag(event, jsEvent, resize, null, [margin, resource])
            : undefined;
    }

    // Onclick handler
    $: onclick = !bgEvent(display) && createHandler($eventClick, display);

    export function reposition() {
        if (!el) {
            return 0;
        }
        let h = height(el);
        margin = repositionEvent(chunk, dayChunks, longChunks, h, !toSeconds($slotDuration));
        return margin + h;
    }
</script>

{#if width > 0}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <article
        bind:this={el}
        class="{classes}"
        {style}
        role="{onclick ? 'button' : undefined}"
        tabindex="{onclick ? 0 : undefined}"
        on:click={onclick}
        on:keydown={onclick && keyEnter(onclick)}
        on:mouseenter={createHandler($eventMouseEnter, display)}
        on:mouseleave={createHandler($eventMouseLeave, display)}
        on:pointerdown={!bgEvent(display) && !helperEvent(display) && createDragHandler($_interaction)}
    >
        <div class="{$theme.eventBody}" use:setContent={content}></div>
        <svelte:component
            this={$_interaction.resizer}
            {event}
            on:pointerdown={createDragHandler($_interaction, 'x')}
        />
    </article>
{/if}
