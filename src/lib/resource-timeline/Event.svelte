<script>
    import {getContext, onMount} from 'svelte';
    import {
        bgEvent, cloneDate, createEventClasses, createEventContent, height, helperEvent, isFunction, keyEnter,
        resourceBackgroundColor, resourceTextColor, setContent, subtractDuration, toEventWithLocalDates, toSeconds,
        toViewWithLocalDates
    } from '$lib/core';
    import {repositionEvent} from './lib.js';

    let {chunk, dayChunks = [], longChunks = {}, resource = undefined} = $props();

    let {
        displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClick,
        eventDidMount, eventClassNames, eventMouseEnter, eventMouseLeave, resources, slotDuration, slotWidth, theme,
        _view, _intlEventTime, _interaction, _iClasses
    } = getContext('state');

    let el = $state();
    let margin = $state(helperEvent(chunk.event.display) ? 1 : 0);
    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);
    // Style
    let width = $derived('slots' in chunk ? chunk.slots * $slotWidth : chunk.days * 100);
    let style = $derived.by(() => {
        let style;
        if ('slots' in chunk) {
            let left = chunk.offset * $slotWidth;
            style =
                `left:${left}px;` +
                `width:${width}px;`
            ;
        } else {
            // Month view
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
        return style;
    });
    // Class
    let classes = $derived([
        bgEvent(display) ? $theme.bgEvent : $theme.event,
        ...$_iClasses([], event),
        ...createEventClasses($eventClassNames, event, $_view)
    ].join(' '));
    // Content
    let [timeText, content] = $derived(createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view));

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

    function createHandler(fn, display) {
        return !helperEvent(display) && isFunction(fn)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)})
            : undefined;
    }

    function createDragHandler(interaction, resize) {
        return interaction.action
            ? jsEvent => interaction.action.drag(
                event,
                jsEvent,
                resize,
                resize && chunk.zeroDuration ? subtractDuration(cloneDate(event.end), $slotDuration) : undefined,
                [margin, resource],
                chunk.zeroDuration
            )
            : undefined;
    }

    export function reposition() {
        if (!el) {
            return 0;
        }
        let h = height(el);
        margin = repositionEvent(chunk, dayChunks, longChunks, h, !toSeconds($slotDuration));
        return margin + h;
    }

    // Handlers
    let onclick = $derived(!bgEvent(display) && createHandler($eventClick, display));
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter, display));
    let onmouseleave = $derived(createHandler($eventMouseLeave, display));
    let onpointerdown = $derived(!bgEvent(display) && !helperEvent(display) && createDragHandler($_interaction));

    let Resizer = $derived($_interaction.resizer);
</script>

{#if width > 0}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <article
        bind:this={el}
        class="{classes}"
        {style}
        role="{onclick ? 'button' : undefined}"
        tabindex="{onclick ? 0 : undefined}"
        {onclick}
        {onkeydown}
        {onmouseenter}
        {onmouseleave}
        {onpointerdown}
    >
        <Resizer
            start
            {event}
            onpointerdown={createDragHandler($_interaction, ['x', 'start'])}
        />
        <div class="{$theme.eventBody}" use:setContent={content}></div>
        <Resizer
            {event}
            on:pointerdown={createDragHandler($_interaction, ['x', 'end'])}
        />
    </article>
{/if}
