<script>
    import {getContext, onMount} from 'svelte';
    import {getPayload, height, setContent, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined} = $props();

    let {resourceLabelContent, resourceLabelDidMount} = getContext('state');

    let el = $state();
    let payload = $state.raw({});

    $effect.pre(() => {
        payload = getPayload(resource);
    });

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

        let h = el ? height(el) : 0;
        payload.height = h;
    });
</script>

<span
    bind:this={el}
    use:setContent={content}
></span>
