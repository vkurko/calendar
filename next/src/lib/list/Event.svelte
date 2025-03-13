<script>
    import {getContext, onMount} from 'svelte';
    import {
        createEventClasses, createEventContent, isFunction, keyEnter, resourceBackgroundColor, resourceTextColor,
        setContent, toEventWithLocalDates, toViewWithLocalDates
    } from '$lib/core';

    let {chunk} = $props();

    let {
        displayEventEnd, eventBackgroundColor, eventTextColor, eventColor, eventContent,
        eventClassNames, eventClick, eventDidMount, eventMouseEnter, eventMouseLeave, resources, theme,
        _view, _intlEventTime, _interaction
    } = getContext('state');

    let el = $state();
    let event = $derived(chunk.event);
    // Style
    let style = $derived.by(() => {
        let style = '';
        let bgColor = event.backgroundColor || resourceBackgroundColor(event, $resources) || $eventBackgroundColor || $eventColor;
        if (bgColor) {
            style = `background-color:${bgColor};`;
        }
        let txtColor = event.textColor || resourceTextColor(event, $resources) || $eventTextColor;
        if (txtColor) {
            style += `color:${txtColor};`;
        }
        style += event.styles.join(';');
        return style;
    });
    // Class
    let classes = $derived([$theme.event, ...createEventClasses($eventClassNames, event, $_view)].join(' '));
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

    function createHandler(fn) {
        return isFunction(fn)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates($_view)})
            : undefined;
    }

    // Handlers
    let onclick = $derived(createHandler($eventClick));
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter));
    let onmouseleave = $derived(createHandler($eventMouseLeave));
    let onpointerdown = $derived($_interaction.action?.noAction);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
    bind:this={el}
    class="{classes}"
    role="{onclick ? 'button' : undefined}"
    tabindex="{onclick ? 0 : undefined}"
    {onclick}
    {onkeydown}
    {onmouseenter}
    {onmouseleave}
    {onpointerdown}
>
    <div class="{$theme.eventTag}" {style}></div>
    <div class="{$theme.eventBody}" use:setContent={content}></div>
</article>
