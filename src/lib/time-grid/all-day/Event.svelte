<script>
    import {getContext, onMount} from 'svelte';
    import {
        ancestor, bgEvent, createEventClasses, createEventContent, height, helperEvent, isFunction, keyEnter, rect,
        repositionEvent, resourceBackgroundColor, resourceTextColor, setContent, task, toEventWithLocalDates,
        toViewWithLocalDates
    } from '$lib/core';

    let {chunk, longChunks = {}} = $props();

    let {displayEventEnd, eventAllUpdated, eventBackgroundColor, eventTextColor, eventClick, eventColor, eventContent,
        eventClassNames, eventDidMount, eventMouseEnter, eventMouseLeave, resources, theme,
        _view, _intlEventTime, _interaction, _iClasses, _tasks} = getContext('state');

    let el = $state();
    let margin = $state(1);
    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let style = $derived.by(() => {
        let style;
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
        if (bgEvent(display)) {
            style = `width:calc(${chunk.days * 100}% + ${(chunk.days - 1)}px);`;
        } else {
            style =
                `width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` +
                `margin-top:${event._margin ?? margin}px;`
            ;
        }
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

    $effect(() => {
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
                null,
                rect(el).top - rect(ancestor(el, 1)).top,
                chunk.zeroDuration
            )
            : undefined;
    }

    export function reposition() {
        if (!el) {
            return;
        }
        margin = repositionEvent(chunk, longChunks, height(el));
    }

    // Handlers
    let onclick = $derived(createHandler($eventClick, display));
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter, display));
    let onmouseleave = $derived(createHandler($eventMouseLeave, display));
    let onpointerdown = $derived(!helperEvent(display) && createDragHandler($_interaction));

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
        onpointerdown={createDragHandler($_interaction, ['x', 'start'])}
    />
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <Resizer
        {event}
        onpointerdown={createDragHandler($_interaction, ['x', 'end'])}
    />
</article>
