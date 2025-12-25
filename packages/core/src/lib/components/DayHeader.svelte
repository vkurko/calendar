<script>
    import {getContext} from 'svelte';
    import {contentFrom, toISOString} from '#lib';

    let {date, alPrefix = ''} = $props();

    let {intlDayHeader, intlDayHeaderAL} = $derived(getContext('state'));
</script>

<time
    datetime="{toISOString(date, 10)}"
    aria-label="{alPrefix}{intlDayHeaderAL.format(date)}"
    {@attach contentFrom(intlDayHeader.format(date))}
></time>
