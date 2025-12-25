<script>
    import {getContext, onMount} from 'svelte';
    import {datesEqual, identity, setPayload} from '#lib';

    let {
        el = $bindable(),
        date,
        allDay = false,
        resource = undefined,
        dateFromPoint = () => date,
        classes = identity,
        disabled = false,
        highlight = false,
        role = 'cell',
        noIeb = false,
        noBeb = false,
        children
    } = $props();

    let {today, interaction: {action}, options: {theme}} = $derived(getContext('state'));
    let {snap} = $derived(getContext('view-state'));  // timeGrid has snap, others don't

    let isToday = $derived(datesEqual(date, today));

    // Class
    let classNames = $derived(classes([
        theme.day,
        theme.weekdays?.[date.getUTCDay()],
        isToday && theme.today,
        highlight && theme.highlight,
        disabled && theme.disabled,
        noIeb && theme.noIeb,
        noBeb && theme.noBeb
    ]));

    // dateFromPoint
    onMount(() => {
        setPayload(el, (x, y) => {
            return {
                allDay,
                date: dateFromPoint(x, y),
                resource,
                dayEl: el,
                disabled
            };
        });
    });

    let onpointerdown = $derived(!disabled && action ? jsEvent => action.select(jsEvent, snap) : undefined);
</script>

<div
    bind:this={el}
    class={classNames}
    {role}
    {onpointerdown}
>{@render children?.()}</div>
