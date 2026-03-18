<script>
    import {getContext} from 'svelte';
    import {datesEqual} from '#lib';

    let {
        date,
        className,
        weekday = true,
        colSpan = 1,
        colIndex,
        ariaHidden = false,
        disabled = false,
        highlight = false,
        cssSpan = false,
        children
    } = $props();

    let {today, options: {theme}} = $derived(getContext('state'));
</script>

<div
    class={[
        className ?? theme.colHead,
        weekday && theme.weekdays?.[date.getUTCDay()],
        weekday && datesEqual(date, today) && theme.today,
        highlight && theme.highlight,
        disabled && theme.disabled
    ]}
    style:--ec-col-group-span={cssSpan ? colSpan : undefined}
    role="{ariaHidden ? null : 'columnheader'}"
    aria-colspan="{ariaHidden || colSpan <= 1 ? null : colSpan}"
    aria-colindex="{ariaHidden ? null : colIndex}"
    aria-hidden="{ariaHidden ? 'true' : null}"
>
    {@render children()}
</div>
