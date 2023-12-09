<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        ancestor,
        createEventClasses,
        createEventContent,
        height,
        max,
        toEventWithLocalDates,
        toViewWithLocalDates,
        setContent,
        repositionEvent,
        helperEvent,
        previewEvent,
        keyEnter
    } from '@event-calendar/core';

    export let chunk;
    export let longChunks = {};
    export let inPopup = false;

    let {dayMaxEvents, displayEventEnd, eventBackgroundColor, eventTextColor, eventClick, eventColor, eventContent,
        eventClassNames, eventDidMount, eventMouseEnter, eventMouseLeave, theme,
        _view, _intlEventTime, _interaction, _iClasses, _resBgColor, _resTxtColor, _hiddenEvents, _popupDate} = getContext('state');

    let el;
    let event;
    let classes;
    let style;
    let content;
    let timeText;
    let margin = 1;
    let hidden = false;
    let display;
    let onclick;

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

        classes = [
            $theme.event,
            ...$_iClasses([], event),
            ...createEventClasses($eventClassNames, event, $_view)
        ].join(' ');
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

    function createDragHandler(interaction, resize) {
        return interaction.action
            ? jsEvent => $_interaction.action.drag(event, jsEvent, resize, inPopup ? $_popupDate : undefined)
            : undefined;
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

    // Onclick handler
    $: onclick = createHandler($eventClick, display);
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
    on:pointerdown={!helperEvent(display) && createDragHandler($_interaction)}
>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
    <svelte:component
        this={$_interaction.resizer}
        {event}
        on:pointerdown={createDragHandler($_interaction, true)}
    />
</article>
