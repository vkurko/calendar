<script>
    import {getContext} from 'svelte';
    import {datesEqual, setContent, toISOString} from '#lib';
    import {Section, Body, Day, Week} from '../time-grid/index.js';
    import Label from './Label.svelte';

    let {
        datesAboveResources, _today, _viewDates, _viewResources, _intlDayHeader, _intlDayHeaderAL, allDaySlot, theme
    } = getContext('state');

    let loops = $derived($datesAboveResources ? [$_viewDates, $_viewResources] : [$_viewResources, $_viewDates]);

    let resourceLabels = $state([]);
</script>

<div class="{$theme.header}">
    <Section>
        {#each loops[0] as item0, i}
            <div class="{$theme.resource}">
                {#if $datesAboveResources}
                    <div class="{$theme.day} {$theme.weekdays?.[item0.getUTCDay()]}{datesEqual(item0, $_today) ? ' ' + $theme.today : ''}">
                        <time
                            datetime="{toISOString(item0, 10)}"
                            aria-label="{$_intlDayHeaderAL.format(item0)}"
                            use:setContent={$_intlDayHeader.format(item0)}
                        ></time>
                    </div>
                {:else}
                    <div class="{$theme.day}">
                        <Label resource={item0} setLabel={e => resourceLabels[i] = e.detail + ', '} />
                    </div>
                {/if}
                {#if loops[1].length > 1}
                    <div class="{$theme.days}">
                        {#each loops[1] as item1}
                            {#if $datesAboveResources}
                                <div class="{$theme.day}" role="columnheader">
                                    <Label resource={item1} date={item0} />
                                </div>
                            {:else}
                                <div
                                    class="{$theme.day} {$theme.weekdays?.[item1.getUTCDay()]}{datesEqual(item1, $_today) ? ' ' + $theme.today : ''}"
                                    role="columnheader"
                                >
                                    <time
                                        datetime="{toISOString(item1, 10)}"
                                        aria-label="{resourceLabels[i]}{$_intlDayHeaderAL.format(item1)}"
                                        use:setContent={$_intlDayHeader.format(item1)}
                                    ></time>
                                </div>
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
