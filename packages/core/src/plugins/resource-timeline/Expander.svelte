<script>
    import {getContext} from 'svelte';
    import {getPayload, identity} from '#lib';

    let {resource} = $props();

    let {resources, theme} = getContext('state');

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
    {#if payload.children?.length}
        <button class="{$theme.button}" {onclick}>
            {#if expanded}&minus;{:else}&plus;{/if}
        </button>
    {/if}
</span>
