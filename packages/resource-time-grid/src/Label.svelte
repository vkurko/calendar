<script>
    import {getContext, onMount} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {setContent, toLocalDate} from '@event-calendar/core';

    export let resource;
    export let date = undefined;

    let {resourceLabelContent, resourceLabelDidMount, theme} = getContext('state');

    let el;
    let content;

    // Content
    $: if ($resourceLabelContent) {
        content = is_function($resourceLabelContent)
            ? $resourceLabelContent({
                resource,
                date: date ? toLocalDate(date) : undefined,
            })
            : $resourceLabelContent;
    } else {
        content = resource.titleHTML ? {html: resource.titleHTML} : resource.title;
    }

    onMount(() => {
        if (is_function($resourceLabelDidMount)) {
            $resourceLabelDidMount({
                resource,
                date: date ? toLocalDate(date) : undefined,
                el
            });
        }
    });
</script>

<div
    bind:this={el}
    class="{$theme.day}"
    use:setContent={content}
></div>
