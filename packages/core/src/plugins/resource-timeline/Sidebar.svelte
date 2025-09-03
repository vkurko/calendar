<script>
    import {getContext, untrack} from 'svelte';
    import {max} from '#lib';
    import Label from './Label.svelte';
    import Expander from './Expander.svelte';

    let {_viewResources, _headerHeight, _bodyEl, _daysHs, _resHs, _sidebarEl, _nestedResources, theme} = getContext('state');

    $effect.pre(() => {
        $_viewResources;
        untrack(() => {
            $_resHs.clear();
        });
    });

    function onwheel(jsEvent) {
        $_bodyEl.scrollBy({
            top: jsEvent.deltaY < 0 ? -30 : 30
        });
    }
</script>

<div class="{$theme.sidebar}">
    <div class="{$theme.sidebarTitle}" style="flex-basis: {$_headerHeight}px"></div>
    <div class="{$theme.content}" bind:this={$_sidebarEl} {onwheel}>
        {#each $_viewResources as resource}
            <div class="{$theme.resource}" style="flex-basis: {max($_daysHs.get(resource) ?? 0, $_resHs.get(resource) ?? 0, 34)}px" role="rowheader">
                {#if $_nestedResources}
                    <Expander {resource} />
                {/if}
                <Label {resource}/>
            </div>
        {/each}
    </div>
</div>
