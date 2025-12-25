<script>
    import {getContext} from 'svelte';
    import {getPayload} from '#lib';

    let {resource} = $props();

    let {options} = $derived(getContext('state'));
    let {resources, theme} = $derived(options);

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
        options.resources = [...resources];
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
        <button class="{theme.button}" {onclick}>
            {#if expanded}&minus;{:else}&plus;{/if}
        </button>
    {/if}
</span>
