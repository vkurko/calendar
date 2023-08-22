<script>
    import {getContext} from 'svelte';
    import {setContent} from '@event-calendar/core';
    import {Section, Body, Day, Week} from '@event-calendar/time-grid';
    import Label from './Label.svelte';

    let {datesAboveResources, _viewDates, _viewResources, _intlDayHeader, _viewClass, allDaySlot, theme} = getContext('state');

    $_viewClass = 'week';

    let loops;
    $: loops = $datesAboveResources ? [$_viewDates, $_viewResources] : [$_viewResources, $_viewDates];
</script>

<div class="{$theme.header}">
    <Section>
        {#each loops[0] as item0}
            <div class="{$theme.resource}">
                {#if $datesAboveResources}
                    <div class="{$theme.day}" use:setContent={$_intlDayHeader.format(item0)}></div>
                {:else}
                    <Label resource={item0} />
                {/if}
                {#if loops[1].length > 1}
                    <div class="{$theme.days}">
                        {#each loops[1] as item1}
                            {#if $datesAboveResources}
                                <Label resource={item1} date={item0} />
                            {:else}
                                <div class="{$theme.day}" use:setContent={$_intlDayHeader.format(item1)}></div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </Section>
    <div class="{$theme.hiddenScroll}"></div>
</div>
{#if $allDaySlot}
    <div class="{$theme.allDay}">
        <div class="{$theme.content}">
            <Section>
                {#if $datesAboveResources}
                    {#each $_viewDates as date}
                        <div class="{$theme.resource}">
                            {#each $_viewResources as resource}
                                <Week dates={[date]} {resource}/>
                            {/each}
                        </div>
                    {/each}
                {:else}
                    {#each $_viewResources as resource}
                        <div class="{$theme.resource}">
                            <Week dates={$_viewDates} {resource}/>
                        </div>
                    {/each}
                {/if}
            </Section>
            <div class="{$theme.hiddenScroll}"></div>
        </div>
    </div>
{/if}
<Body>
{#each loops[0] as item0}
    <div class="{$theme.resource}">
        {#each loops[1] as item1}
            <Day
                date={$datesAboveResources ? item0 : item1}
                resource={$datesAboveResources ? item1 : item0}
            />
        {/each}
    </div>
{/each}
</Body>