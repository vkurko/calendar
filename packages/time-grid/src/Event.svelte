<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        createEventContent,
        toEventWithLocalDates,
        toViewWithLocalDates,
        setContent,
        bgEvent,
        helperEvent,
        ghostEvent
    } from '@event-calendar/common';

    export let date;
    export let chunk;

    let {displayEventEnd, eventBackgroundColor, eventTextColor,eventColor, eventContent, eventClick, eventDidMount,
        eventMouseEnter, eventMouseLeave, slotEventOverlap, slotDuration, slotHeight, theme, _view, _intlEventTime,
        _interaction, _classes, _draggable, _resBgColor, _resTxtColor} = getContext('state');

    let {_slotTimeLimits} = getContext('view-state');

    let el;
    let event;
    let display;
    let classes;
    let style;
    let content;
    let timeText;
    let dragged = false;

    $: event = chunk.event;

    $: {
        display = event.display;

        // Style
        let step = $slotDuration.seconds / 60;
        let offset = $_slotTimeLimits.min.seconds / 60;
        let start = (chunk.start - date) / 1000 / 60;
        let end = (chunk.end - date) / 1000 / 60;
        let top = (start - offset) / step * $slotHeight;
        let height = (end - start) / step * $slotHeight;
        let maxHeight = ($_slotTimeLimits.max.seconds / 60 - start) / step * $slotHeight;
        let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || $_resTxtColor(event) || $eventTextColor;
        style =
            `top:${top}px;` +
            `min-height:${height}px;` +
            `height:${height}px;` +
            `max-height:${maxHeight}px;`
        ;
        if (bgColor) {
            style += `background-color:${bgColor};`;
        }
        if (txtColor) {
            style += `color:${txtColor};`;
        }
        if (!bgEvent(display) && !helperEvent(display) || ghostEvent(display)) {
            style +=
                `z-index:${chunk.column + 1};` +
                `left:${100 / chunk.group.columns.length * chunk.column}%;` +
                `width:${100 / chunk.group.columns.length * ($slotEventOverlap ? 0.5 * (1 + chunk.group.columns.length - chunk.column) : 1)}%;`
            ;
        }

        // Class
        classes = $_classes(bgEvent(display) ? $theme.bgEvent : $theme.event, event);
    }

    // Content
    $: [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);

    onMount(() => {
        if (is_function($eventDidMount)) {
            $eventDidMount({
                event: toEventWithLocalDates(event),
                timeText,
                el,
                view: toViewWithLocalDates($_view)
            });
        }
    });

    function createHandler(fn, display) {
        return !helperEvent(display) && is_function(fn)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)})
            : undefined;
    }

    function createDragHandler(resize) {
        return jsEvent => $_interaction.action.drag(event, jsEvent, resize);
    }
</script>

<div
    bind:this={el}
    class="{classes}"
    {style}
    on:click={!bgEvent(display) && createHandler($eventClick, display)}
    on:mouseenter={createHandler($eventMouseEnter, display)}
    on:mouseleave={createHandler($eventMouseLeave, display)}
    on:pointerdown={!bgEvent(display) && !helperEvent(display) && $_draggable(event) && createDragHandler()}
>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <svelte:component
        this={$_interaction.resizer}
        {event}
        on:pointerdown={createDragHandler(true)}
    />
</div>
