<script>
    import {getContext} from 'svelte';

    let {slots} = $props();

    let {options: {theme}} = $derived(getContext('state'));
    let {slotLabelPeriodicity} = $derived(getContext('view-state'));
</script>

<!-- A group of slots per slot label with a solid line, dotted lines between the slots inside the group -->
<div class="{theme.lines}" aria-hidden="true">
    {#each slots as slot}
        <div style:--ec-slot-label-periodicity={slot[2]}>
            {#each {length: (slot[2] ?? slotLabelPeriodicity) - 1}}<div></div>{/each}
        </div>
    {/each}
</div>
