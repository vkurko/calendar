<script>
    import {getContext, onMount} from 'svelte';
    import {
        bgEvent, cloneDate, contentFrom, createEventClasses, createEventContent, datesEqual, entries,
        eventBackgroundColor as getEventBackgroundColor, eventTextColor as getEventTextColor, findFirstResource,
        helperEvent, identity, isFunction, keyEnter, setMidnight, toEventWithLocalDates, toViewWithLocalDates
    } from '#lib';

    let {
        el = $bindable(),
        chunk,
        classes = identity,
        styles = identity,
        onpointerdown,
        body
    } = $props();

    let {intlEventTime, resources, view, options: {
        displayEventEnd, eventBackgroundColor, eventColor, eventContent, eventClick, eventDidMount, eventClassNames,
        eventMouseEnter, eventMouseLeave, eventTextColor, theme
    }} = $derived(getContext('state'));

    let event = $derived(chunk.event);
    let display = $derived(chunk.event.display);

    // Style
    let bgColor = $derived(
        event.backgroundColor ?? getEventBackgroundColor(chunk.resource ?? findFirstResource(event, resources)) ??
        eventBackgroundColor ?? eventColor
    );
    let txtColor = $derived(
        event.textColor ?? getEventTextColor(chunk.resource ?? findFirstResource(event, resources)) ?? eventTextColor
    );
    let style = $derived(entries(styles(
        {'background-color': bgColor, 'color': txtColor}
    )).map(entry => `${entry[0]}:${entry[1]}`).concat(event.styles).join(';'));

    // Class
    let classNames = $derived.by(() => {
        let classNames = [bgEvent(display) ? theme.bgEvent : theme.event];

        // Clipped or not
        if (event.allDay) {
            // Setting midnight and 1-second manipulation is mainly needed for timeline view
            if (!datesEqual(setMidnight(cloneDate(chunk.start)), event.start)) {
                classNames.push(theme.startClipped);
            }
            let end1 = cloneDate(chunk.end);
            let end2 = cloneDate(event.end);
            end1.setUTCSeconds(end1.getUTCSeconds() - 1);
            end2.setUTCSeconds(end2.getUTCSeconds() - 1);
            if (!datesEqual(setMidnight(end1), setMidnight(end2))) {
                classNames.push(theme.endClipped);
            }
        } else {
            if (!datesEqual(chunk.start, event.start)) {
                classNames.push(theme.startClipped);
            }
            if (!datesEqual(chunk.end, event.end)) {
                classNames.push(theme.endClipped);
            }
        }

        return classes(classNames.concat(createEventClasses(eventClassNames, event, view)));
    });

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
