<script>
    import {getContext, onMount, untrack} from 'svelte';
    import {ceil, height, setContent, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined} = $props();

    let {resourceLabelContent, resourceLabelDidMount, _resHs} = getContext('state');

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

    $effect(() => {
        content;
        untrack(() => {
            $_resHs.set(resource, ceil(height(el) + 10));
            $_resHs = $_resHs;
        });
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
    use:setContent={content}
></span>
