<script>
    import {getContext, onMount, tick, untrack} from 'svelte';
    import {contentFrom, createContent, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined, setLabel = undefined} = $props();

    let {intlDayHeaderAL, snippets, options: {resourceLabelContent, resourceLabelDidMount}} = $derived(getContext('state'));

    let el = $state();
    // Content
    let content = $derived(createContent(
        resourceLabelContent,
        () => ({resource, date: date ? toLocalDate(date) : undefined}),
        () => resource.title,
        snippets.resourceLabelContent
    ));
    // Aria-label
    let ariaLabel = $state();
    $effect(() => {
        // Track everything the rendered content depends on, including the user snippet
        content;
        resource;
        date;
        untrack(() => {
            // Accessing innerText after tick significantly improves performance
            if (date) {
                tick().then(() => el && (ariaLabel = intlDayHeaderAL.format(date) + ', ' + el.innerText));
            } else if (setLabel) {
                ariaLabel = undefined;
                tick().then(() => el && setLabel(el.innerText));
            }
        });
    });

    onMount(() => {
        if (isFunction(resourceLabelDidMount)) {
            resourceLabelDidMount({
                resource,
                date: date ? toLocalDate(date) : undefined,
                el
            });
        }
    });
</script>

<span
    bind:this={el}
    aria-label="{ariaLabel}"
    {@attach contentFrom(content.content, content.snippet)}
>{@render content.snippet?.(content.arg)}</span>
