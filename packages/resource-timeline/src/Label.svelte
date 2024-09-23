<script>
    import {getContext, onMount} from 'svelte';
    import {setContent, toLocalDate, isFunction} from '@event-calendar/core';

    export let resource;
    export let date = undefined;

    let {resourceLabelContent, resourceLabelDidMount} = getContext('state');

    let el;
    let content;

    // Content
    $: if ($resourceLabelContent) {
        content = isFunction($resourceLabelContent)
            ? $resourceLabelContent({
                resource,
                date: date ? toLocalDate(date) : undefined,
            })
            : $resourceLabelContent;
    } else {
        content = resource.title;
    }

    onMount(() => {
        if (isFunction($resourceLabelDidMount)) {
            $resourceLabelDidMount({
                resource,
                date: date ? toLocalDate(date) : undefined,
                el
            });
        }
    });
</script>

<span
    bind:this={el}
    use:setContent={content}
></span>
