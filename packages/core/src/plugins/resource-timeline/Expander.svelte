<script>
    import {getContext} from 'svelte';
    import {contentFrom, getPayload, isFunction, toViewWithLocalDates} from '#lib';
    import {isExpanded} from './lib.js';

    let {resource} = $props();

    let {resources, view, options: {
        buttonText, icons, resourceExpand, resourcesInitiallyExpanded, theme
    }} = $derived(getContext('state'));

    let payload = $state.raw({});
    let expanded = $derived(isExpanded(resource, resourcesInitiallyExpanded));
    let title = $derived(buttonText[expanded ? 'collapse' : 'expand']);

    $effect.pre(() => {
        payload = getPayload(resource);
    });

    function onclick(jsEvent) {
        resource.expanded = expanded = !expanded;
        resources.length = resources.length;
        if (isFunction(resourceExpand)) {
            resourceExpand({resource, jsEvent, view: toViewWithLocalDates(view)});
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
            {title}
            {onclick}
            {@attach contentFrom(icons[expanded ? 'collapse' : 'expand'])}
        >
        </button>
    {/if}
</span>
