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
        children
    } = $props();

    let {_interaction, _today, highlightedDates, theme} = getContext('state');

    let isToday = $derived(datesEqual(date, $_today));

    // Class
    let classNames = $derived(classes([
        $theme.day,
        $theme.weekdays?.[date.getUTCDay()],
        isToday && $theme.today,
        highlight && $theme.highlight,
        disabled && $theme.disabled
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
</script>

<div
    bind:this={el}
    class={classNames}
    {role}
    onpointerdown={!disabled ? $_interaction.action?.select : undefined}
>{@render children?.()}</div>
