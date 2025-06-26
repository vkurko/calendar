<script>
    import {getContext, onMount} from 'svelte';
    import {
        bgEvent, createEventClasses, createEventContent, entries, fromEntries, helperEvent, identity, isFunction, keyEnter,
        resourceBackgroundColor, resourceTextColor, setContent, toEventWithLocalDates, toViewWithLocalDates
    } from '#lib';

    let {
        el = $bindable(),
        chunk,
        classes = identity,
        styles = identity,
        onpointerdown,
        body
    } = $props();

    let {
        displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount, eventClassNames,
        eventMouseEnter, eventMouseLeave, eventTextColor, resources, theme, _view, _intlEventTime
    } = getContext('state');

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let bgColor = $derived(event.backgroundColor ?? resourceBackgroundColor(event, $resources) ?? $eventBackgroundColor ?? $eventColor);
    let txtColor = $derived(event.textColor ?? resourceTextColor(event, $resources) ?? $eventTextColor);
    let style = $derived(entries(styles(
        {'background-color': bgColor, 'color': txtColor, ...fromEntries(event.styles.map(style => style.split(':')))}
    )).map(entry => `${entry[0]}:${entry[1]}`).join(';'));

    // Class
    let classNames = $derived(classes([
        bgEvent(display) ? $theme.bgEvent : $theme.event,
        ...createEventClasses($eventClassNames, event, $_view)
    ]).join(' '));

    // Content
    let [timeText, content] = $derived(createEventContent(
        chunk, $displayEventEnd, $eventContent, $theme, $_intlEventTime, $_view
    ));

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

    // Handlers
    let onclick = $derived(!bgEvent(display) && createHandler($eventClick, display) || undefined);
    let onkeydown = $derived(onclick && keyEnter(onclick));
    let onmouseenter = $derived(createHandler($eventMouseEnter, display));
    let onmouseleave = $derived(createHandler($eventMouseLeave, display));
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
        <div class={$theme.eventBody} use:setContent={content}></div>
    {/snippet}
    {#if body}
        {@render body(defaultBody, bgColor, txtColor)}
    {:else}
        {@render defaultBody()}
    {/if}
</article>
