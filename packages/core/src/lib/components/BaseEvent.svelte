<script>
    import {getContext, onMount} from 'svelte';
    import {
        bgEvent, createEventClasses, createEventContent, entries, helperEvent, identity, isFunction, keyEnter,
        resourceBackgroundColor, resourceTextColor, contentFrom, toEventWithLocalDates, toViewWithLocalDates
    } from '#lib';

    let {
        el = $bindable(),
        chunk,
        classes = identity,
        styles = identity,
        onpointerdown,
        body
    } = $props();

    let {intlEventTime, view, options: {
        displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount, eventClassNames,
        eventMouseEnter, eventMouseLeave, eventTextColor, resources, theme
    }} = $derived(getContext('state'));

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let bgColor = $derived(event.backgroundColor ?? resourceBackgroundColor(event, resources) ?? eventBackgroundColor ?? eventColor);
    let txtColor = $derived(event.textColor ?? resourceTextColor(event, resources) ?? eventTextColor);
    let style = $derived(entries(styles(
        {'background-color': bgColor, 'color': txtColor}
    )).map(entry => `${entry[0]}:${entry[1]}`).concat(event.styles).join(';'));

    // Class
    let classNames = $derived(classes([
        bgEvent(display) ? theme.bgEvent : theme.event,
        ...createEventClasses(eventClassNames, event, view)
    ]));

    // Content
    let [timeText, content] = $derived(createEventContent(
        chunk, displayEventEnd, eventContent, theme, intlEventTime, view
    ));

    onMount(() => {
        if (isFunction(eventDidMount)) {
            eventDidMount({
                event: toEventWithLocalDates(event),
                timeText,
                el,
                view: toViewWithLocalDates(view)
            });
        }
    });

    function createHandler(fn, display) {
        return isFunction(fn) && !helperEvent(display)
            ? jsEvent => fn({event: toEventWithLocalDates(event), el, jsEvent, view: toViewWithLocalDates(view)})
            : undefined;
    }

    // Handlers
    let onclick = $derived(!bgEvent(display) && createHandler(eventClick, display) || undefined);
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler(eventMouseEnter, display));
    let onmouseleave = $derived(createHandler(eventMouseLeave, display));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
    bind:this={el}
    class={classNames}
    {style}
    role={onclick ? 'button' : undefined}
    tabindex={onclick ? 0 : undefined}
    {onclick}
    {onkeydown}
    {onmouseenter}
    {onmouseleave}
    {onpointerdown}
>
    {#snippet defaultBody()}
        <div class={theme.eventBody} {@attach contentFrom(content)}></div>
    {/snippet}
    {#if body}
        {@render body(defaultBody, bgColor, txtColor)}
    {:else}
        {@render defaultBody()}
    {/if}
</article>
