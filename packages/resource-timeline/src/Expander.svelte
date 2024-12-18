<script>
    import {getContext} from 'svelte';
    import {getPayload, identity} from '@event-calendar/core';

    export let resource;

    let {resources, theme} = getContext('state');

    let payload = {};

    $: payload = getPayload(resource);

    function handleClick() {
        payload.expanded = !payload.expanded;
        toggle(payload.children, payload.expanded);
        resources.update(identity);
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
    <span class="{$theme.expander}"></span>
{/each}

<span class="{$theme.expander}">
    {#if payload.children.length}
        <button class="{$theme.button}" on:click={handleClick}>
            {#if payload.expanded}&minus;{:else}&plus;{/if}
        </button>
    {/if}
</span>
