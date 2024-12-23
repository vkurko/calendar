<script>
    import {getContext} from 'svelte';
    import {getPayload, isFunction, toViewWithLocalDates} from '#lib';

    let {resource} = $props();

    let {resources, view, options: {resourceExpand, theme}} = $derived(getContext('state'));

    let payload = $state.raw({});
    let expanded = $derived(resource.expanded);

    $effect.pre(() => {
        payload = getPayload(resource);
    });

    function onclick() {
        resource.expanded = expanded = !expanded;
        toggle(payload.children);
        resources.length = resources.length;
        if (isFunction(resourceExpand)) {
            resourceExpand({resource, view: toViewWithLocalDates(view)});
        }
    }

    function toggle(children) {
        for (let child of children) {
            let payload = getPayload(child);
            payload.hidden = !expanded;
            if (child.expanded) {
                toggle(payload.children);
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
