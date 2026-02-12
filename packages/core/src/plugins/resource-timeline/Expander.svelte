<script>
    import {getContext} from 'svelte';
    import {contentFrom, getPayload} from '#lib';

    let {resource} = $props();

    const MINUS_SIGN = '\u2212';
    const PLUS_SIGN = '\u002b';

    let {
        resources,
        options: {
            theme,
            resourceLabelExpander: {
                expandedIcon = MINUS_SIGN,
                nonExpandedIcon = PLUS_SIGN
            } = {}
        }
    } = $derived(getContext('state'));

    let payload = $state.raw({});
    let expanded = $state(true);

    $effect.pre(() => {
        payload = getPayload(resource);
        expanded = payload.expanded;
    });

    function onclick() {
        expanded = !expanded;
        payload.expanded = expanded;
        toggle(payload.children, expanded);
        resources.length = resources.length;
    }

    function toggle(children, expand) {
        for (let child of children) {
            let payload = getPayload(child);
            payload.hidden = !expand;
            if (payload.expanded) {
                toggle(payload.children, expand);
            }
        }
    }
</script>

{#each Array(payload.level) as level}
    <span class="{theme.expander}"></span>
{/each}

<span class="{theme.expander}">
    {#if payload.children?.length}
        <button
            class="{theme.button}"
            aria-label="{expanded ? MINUS_SIGN : PLUS_SIGN}"
            {onclick}
            {@attach expanded ? contentFrom(expandedIcon) : contentFrom(nonExpandedIcon)}
        >
        </button>
    {/if}
</span>
