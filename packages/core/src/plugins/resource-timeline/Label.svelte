<script>
    import {getContext, onMount} from 'svelte';
    import {contentFrom, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined} = $props();

    let {resourceLabelContent, resourceLabelDidMount} = getContext('state');

    let el = $state();
    // Content
    let content = $derived.by(() => {
        if ($resourceLabelContent) {
            return isFunction($resourceLabelContent)
                ? $resourceLabelContent({
                    resource,
                    date: date ? toLocalDate(date) : undefined,
                })
                : $resourceLabelContent;
        } else {
            return resource.title;
        }
    });

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
    {@attach contentFrom(content)}
></span>
