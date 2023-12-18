<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {
        createEventContent,
        toEventWithLocalDates,
        toViewWithLocalDates,
        setContent,
        createEventClasses,
        keyEnter
    } from '@event-calendar/core';

    export let chunk;

    let {displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent, eventClassNames, eventClick,
        eventDidMount, eventMouseEnter, eventMouseLeave, theme, _view, _intlEventTime, _resBgColor, _resTxtColor,
        _interaction} = getContext('state');

    let el;
    let event;
    let classes;
    let style;
    let content;
    let timeText;
    let onclick;

    $: event = chunk.event;

    $: {
        // Class & Style
        style = '';
        let bgColor = event.backgroundColor || $_resBgColor(event) || $eventBackgroundColor || $eventColor;
        if (bgColor) {
            style = `background-color:${bgColor};`;
        }
        let txtColor = event.textColor || $_resTxtColor(event) || $eventTextColor;
        if (txtColor) {
            style += `color:${txtColor};`;
        }

        classes = [
            $theme.event,
            ...createEventClasses($eventClassNames, event, $_view)
        ].join(' ');
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
        return is_function(fn)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)})
            : undefined;
    }

    // Onclick handler
    $: onclick = createHandler($eventClick);
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<article
    bind:this={el}
    class="{classes}"
    role="{onclick ? 'button' : undefined}"
    tabindex="{onclick ? 0 : undefined}"
    on:click={onclick}
    on:keydown={onclick && keyEnter(onclick)}
    on:mouseenter={createHandler($eventMouseEnter)}
    on:mouseleave={createHandler($eventMouseLeave)}
    on:pointerdown={$_interaction.action?.noAction}
>
    <div class="{$theme.eventTag}" {style}></div>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
</article>