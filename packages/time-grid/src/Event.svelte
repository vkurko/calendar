<script>
    import {afterUpdate, getContext, onMount} from 'svelte';
    import {
        bgEvent, createEventClasses, createEventContent, ghostEvent, helperEvent, isFunction, keyEnter,
        resourceBackgroundColor, resourceTextColor, setContent, task, toEventWithLocalDates, toViewWithLocalDates
    } from '@event-calendar/core';

    export let date;
    export let chunk;

    let {displayEventEnd, eventAllUpdated, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClick,
        eventDidMount, eventClassNames, eventMouseEnter, eventMouseLeave, slotEventOverlap, slotDuration, slotHeight,
        resources, theme,
        _view, _intlEventTime, _interaction, _iClasses, _slotTimeLimits, _tasks} = getContext('state');

    let el;
    let event;
    let display;
    let classes;
    let style;
    let content;
    let timeText;
    let onclick;

    $: event = chunk.event;

    $: {
        display = event.display;

        // Style
        let step = $slotDuration.seconds;
        let offset = $_slotTimeLimits.min.seconds;
        let start = (chunk.start - date) / 1000;
        let end = (chunk.end - date) / 1000;
        let top = (start - offset) / step * $slotHeight;
        let height = (end - start) / step * $slotHeight || $slotHeight;
        let maxHeight = ($_slotTimeLimits.max.seconds - start) / step * $slotHeight;
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
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
            ? jsEvent => interaction.action.drag(
                event,
                jsEvent,
                resize,
                undefined,
                undefined,
                chunk.zeroDuration
            )
            : undefined;
    }

    // Onclick handler
    $: onclick = !bgEvent(display) && createHandler($eventClick, display);
</script>

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
    <svelte:component
        this={$_interaction.resizer}
        start
        {event}
        on:pointerdown={createDragHandler($_interaction, ['y', 'start'])}
    />
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <svelte:component
        this={$_interaction.resizer}
        {event}
        on:pointerdown={createDragHandler($_interaction, ['y', 'end'])}
    />
</article>
