<script>
    import {getContext, onMount, untrack} from 'svelte';
    import {setContent, toLocalDate, isFunction} from '#lib';

    let {resource, date = undefined, setLabel = undefined} = $props();

    let {resourceLabelContent, resourceLabelDidMount, _intlDayHeaderAL} = getContext('state');

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
    // Aria-label
    let ariaLabel = $state();
    $effect(() => {
        content;
        untrack(() => {
            if (date) {
                ariaLabel = $_intlDayHeaderAL.format(date) + ', ' + el.innerText;
            } else if (setLabel) {
                ariaLabel = undefined;
                setLabel(el.innerText);
            }
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
    aria-label="{ariaLabel}"
    use:setContent={content}
></span>
