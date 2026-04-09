<script>
    import {getContext, onMount, tick, untrack} from 'svelte';
    import {contentFrom, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined, setLabel = undefined} = $props();

    let {intlDayHeaderAL, options: {resourceLabelContent, resourceLabelDidMount}} = $derived(getContext('state'));

    let el = $state();
    // Content
    let content = $derived.by(() => {
        if (resourceLabelContent) {
            return isFunction(resourceLabelContent)
                ? resourceLabelContent({
                    resource,
                    date: date ? toLocalDate(date) : undefined,
                })
                : resourceLabelContent;
        } else {
            return resource.title;
        }
    });
    // Aria-label
    let ariaLabel = $state();
    $effect(() => {
        content;
        untrack(() => {
            // Accessing innerText after tick significantly improves performance
            if (date) {
                tick().then(() => ariaLabel = intlDayHeaderAL.format(date) + ', ' + el.innerText);
            } else if (setLabel) {
                ariaLabel = undefined;
                tick().then(() => setLabel(el.innerText));
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
    {@attach contentFrom(content)}
></span>
