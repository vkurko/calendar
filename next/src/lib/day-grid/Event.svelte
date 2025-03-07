<script>
    import {getContext, onMount} from 'svelte';
    import {
        ancestor, bgEvent, createEventClasses, createEventContent, height, helperEvent, isFunction, keyEnter, max, rect,
        repositionEvent, resourceBackgroundColor, resourceTextColor, setContent, task, toEventWithLocalDates,
        toViewWithLocalDates
    } from '$lib/core';

    let {chunk, longChunks = {}, inPopup = false, dates = []} = $props();

    let {dayMaxEvents, displayEventEnd, eventAllUpdated, eventBackgroundColor, eventTextColor, eventClick, eventColor,
        eventContent, eventClassNames, eventDidMount, eventMouseEnter, eventMouseLeave, resources, theme,
        _view, _intlEventTime, _interaction, _iClasses, _hiddenEvents, _popupDate, _tasks} = getContext('state');

    let el = $state();
    let margin = $state(1);
    let hidden = $state(false);

    let event = $derived(chunk.event);
    let display = $derived(event.display);

    // Style
    let style = $derived.by(() => {
        let style;
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
        if (bgEvent(display)) {
            style = `width:calc(${chunk.days * 100}% + ${(chunk.days - 1)}px);`;
        } else {
            let marginTop = margin;
            if (event._margin) {
                // Force margin for helper events
                let [_margin, _dates] = event._margin;
                if (chunk.date >= _dates[0] && chunk.date <= _dates.at(-1)) {
                    marginTop = _margin;
                }
            }
            style =
                `width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` +
                `margin-top:${marginTop}px;`;
        }
        if (bgColor) {
            style += `background-color:${bgColor};`;
        }
        if (txtColor) {
            style += `color:${txtColor};`;
        }
        if (hidden) {
            style += 'visibility:hidden;';
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
            ? jsEvent =>
                $_interaction.action.drag(
                    event,
                    jsEvent,
                    resize,
                    inPopup ? $_popupDate : null,
                    [rect(el).top - rect(ancestor(el, 1)).top, dates],
                    chunk.zeroDuration
                )
            : undefined;
    }

    export function reposition() {
        if (!el) {
            return;
        }
        margin = repositionEvent(chunk, longChunks, height(el));
        if ($dayMaxEvents === true) {
            hide();
        } else {
            hidden = false;
        }
    }

    function hide() {
        let dayEl = ancestor(el, 2);
        let h = height(dayEl) - height(dayEl.firstElementChild) - footHeight(dayEl);
        hidden = chunk.bottom > h;
        let update = false;
        // Hide or show the event throughout all days
        for (let date of chunk.dates) {
            let hiddenEvents = $_hiddenEvents[date.getTime()];
            if (hiddenEvents) {
                let size = hiddenEvents.size;
                if (hidden) {
                    hiddenEvents.add(chunk.event);
                } else {
                    hiddenEvents.delete(chunk.event);
                }
                if (size !== hiddenEvents.size) {
                    update = true;
                }
            }
        }
        if (update) {
            $_hiddenEvents = $_hiddenEvents;
        }
    }

    function footHeight(dayEl) {
        let h = 0;
        for (let i = 0; i < chunk.days; ++i) {
            h = max(h, height(dayEl.lastElementChild));
            dayEl = dayEl.nextElementSibling;
            if (!dayEl) {
                break;
            }
        }
        return h;
    }

    // Handlers
    let onclick = $derived(createHandler($eventClick, display));
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter, display));
    let onmouseleave = $derived(createHandler($eventMouseLeave, display));
    let onpointerdown = $derived(!helperEvent(display) ? createDragHandler($_interaction) : undefined);

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
