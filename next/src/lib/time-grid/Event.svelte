<script>
    import {getContext, onMount} from 'svelte';
    import {
        bgEvent, createEventClasses, createEventContent, ghostEvent, helperEvent, isFunction, keyEnter, max,
        resourceBackgroundColor, resourceTextColor, setContent, toEventWithLocalDates, toViewWithLocalDates
    } from '$lib/core';

    let {date, chunk} = $props();

    let {
        displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClick,
        eventDidMount, eventClassNames, eventMouseEnter, eventMouseLeave, slotEventOverlap, slotDuration, slotHeight,
        resources, theme,
        _view, _intlEventTime, _interaction, _iClasses, _slotTimeLimits
    } = getContext('state');

    let el = $state();
    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let style = $derived.by(() => {
        let step = $slotDuration.seconds;
        let offset = $_slotTimeLimits.min.seconds;
        let start = (chunk.start - date) / 1000;
        let end = (chunk.end - date) / 1000;
        let top = (start - offset) / step * $slotHeight;
        let height = max((end - start) / step * $slotHeight, $slotHeight);
        let maxHeight = ($_slotTimeLimits.max.seconds - start) / step * $slotHeight;
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
        let style =
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

    function createDragHandler(interaction, display, resize) {
        return interaction.action && !bgEvent(display) && !helperEvent(display)
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

    // Handlers
    let onclick = $derived(!bgEvent(display) && createHandler($eventClick, display) || undefined);
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter, display));
    let onmouseleave = $derived(createHandler($eventMouseLeave, display));
    let onpointerdown = $derived(createDragHandler($_interaction, display));

    let Resizer = $derived($_interaction.resizer);
</script>

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
        onpointerdown={createDragHandler($_interaction, display, ['y', 'start'])}
    />
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <Resizer
        {event}
        onpointerdown={createDragHandler($_interaction, display, ['y', 'end'])}
    />
</article>
