<script>
    import {getContext} from 'svelte';
    import {contentFrom, toISOString} from '#lib';

    let {date, alPrefix = ''} = $props();

    let {_intlDayHeader, _intlDayHeaderAL} = getContext('state');
</script>

<time
    datetime="{toISOString(date, 10)}"
    aria-label="{alPrefix}{$_intlDayHeaderAL.format(date)}"
    {@attach contentFrom($_intlDayHeader.format(date))}
></time>
