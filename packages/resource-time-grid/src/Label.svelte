<script>
    import {getContext, onMount, afterUpdate, createEventDispatcher} from 'svelte';
    import {is_function} from 'svelte/internal';
    import {setContent, toLocalDate} from '@event-calendar/core';

    export let resource;
    export let date = undefined;

    let {resourceLabelContent, resourceLabelDidMount, _intlDayHeaderAL} = getContext('state');

    const dispatch = createEventDispatcher();

    let el;
    let content;
    let ariaLabel;

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

    afterUpdate(() => {
        if (date) {
            ariaLabel = $_intlDayHeaderAL.format(date) + ', ' + el.innerText;
        } else {
            ariaLabel = undefined;
            dispatch('text', el.innerText);
        }
    });
</script>

<span
    bind:this={el}
    aria-label="{ariaLabel}"
    use:setContent={content}
></span>
