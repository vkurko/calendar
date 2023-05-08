<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {createEventContent, toEventWithLocalDates, toViewWithLocalDates} from '@event-calendar/common';
    import {setContent} from '@event-calendar/common';

    export let chunk;

    let {displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClick, eventDidMount,
        eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime, _resBgColor, _resTxtColor} = getContext('state');

    let el;
    let event;
    let style;
    let classes;
    let content;
    let timeText;

    $: event = chunk.event;

    $: {
        // Class & Style
        style = '';
        let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;
        if (bgColor) {
            style = `background-color:${bgColor};`;
        }

        let txtColor = evet.textColor || $_resTxtColor(event) || $eventTextColor;
        if (txtColor) {
            style += `color:${txtColor};`;
        }

        classes = '';

        if (event.className) {
            classes += ` ${event.className}`;
        }
    }

    $: {
        // Content
        [timeText, content] = createEventContent(chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view);
    }

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

    function createHandler(fn) {
        return jsEvent => {
            if (is_function(fn)) {
                fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)});
            }
        };
    }
</script>

<div
    bind:this={el}
    class="{$theme.event} {classes}"
    on:click={createHandler($eventClick)}
    on:mouseenter={createHandler($eventMouseEnter)}
    on:mouseleave={createHandler($eventMouseLeave)}
>
    <div class="{$theme.eventTag}" {style}></div>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
</div>