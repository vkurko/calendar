<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        ancestor,
        createEventContent,
        height,
        max,
        toEventWithLocalDates,
        toViewWithLocalDates,
        setContent,
        repositionEvent,
        helperEvent,
        previewEvent
    } from '@event-calendar/common';

    export let chunk;
    export let longChunks = {};
    export let inPopup = false;

    let {dayMaxEvents, displayEventEnd, eventBackgroundColor, eventTextColor, eventClick, eventColor, eventContent, eventDidMount,
        eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime, _interaction, _classes, _draggable, _resBgColor, _resTxtColor} = getContext('state');
    let {_hiddenEvents, _popupDate} = getContext('view-state');

    let el;
    let event;
    let classes;
    let style;
    let content;
    let timeText;
    let margin = 1;
    let hidden = false;
    let display;

    $: event = chunk.event;

    $: {
        display = event.display;

        // Class & Style
        let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;
        let txtColor = event.textColor || $_resTxtColor(event) || $eventTextColor;
        style =
            `width:calc(${chunk.days * 100}% + ${(chunk.days - 1) * 7}px);` +
            `margin-top:${margin}px;`
        ;
        if (bgColor) {
            style += `background-color:${bgColor};`;
        }
        if (txtColor) {
            style += `color:${txtColor};`;
        }
        if (hidden) {
            style += 'visibility:hidden;';
        }

        classes = $_classes($theme.event, event);
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
        return jsEvent => $_interaction.action.drag(event, jsEvent, resize, inPopup ? $_popupDate : undefined);
    }

    export function reposition() {
        if (!el || previewEvent(display) || inPopup) {
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
</script>

<div
    bind:this={el}
    class="{classes}"
    {style}
    on:click={createHandler($eventClick, display)}
    on:mouseenter={createHandler($eventMouseEnter, display)}
    on:mouseleave={createHandler($eventMouseLeave, display)}
    on:pointerdown={!helperEvent(display) && $_draggable(event) && createDragHandler()}
>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <svelte:component
        this={$_interaction.resizer}
        {event}
        on:pointerdown={createDragHandler(true)}
    />
</div>
