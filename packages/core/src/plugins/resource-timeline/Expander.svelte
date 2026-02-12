<script>
    import {getContext} from 'svelte';
    import {contentFrom, getPayload, isFunction, toViewWithLocalDates} from '#lib';

    let {resource} = $props();

    let {resources, view, options: {buttonText, icons, resourceExpand, theme}} = $derived(getContext('state'));

    let payload = $state.raw({});
    let expanded = $derived(resource.expanded);
    let title = $derived(buttonText[expanded ? 'collapse' : 'expand']);

    $effect.pre(() => {
        payload = getPayload(resource);
    });

    function onclick(jsEvent) {
        resource.expanded = expanded = !expanded;
        toggle(payload.children);
        resources.length = resources.length;
        if (isFunction(resourceExpand)) {
            resourceExpand({resource, jsEvent, view: toViewWithLocalDates(view)});
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
        <button
            class="{theme.button}"
            aria-label="{title}"
            title="{title}"
            {onclick}
            {@attach contentFrom(icons[expanded ? 'collapse' : 'expand'])}
        >
        </button>
    {/if}
</span>
