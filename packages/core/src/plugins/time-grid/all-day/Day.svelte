<script>
    import {getContext, onMount} from 'svelte';
    import {datesEqual, outsideRange, runReposition, setPayload} from '#lib';
    import Event from './Event.svelte';

    let {date, chunks, bgChunks, longChunks, iChunks = [], resource = undefined} = $props();

    let {highlightedDates, theme, validRange, _interaction, _today} = getContext('state');

    let el = $state();
    let refs = [];

    let dayChunks = $derived(chunks.filter(chunk => datesEqual(chunk.date, date)));
    let dayBgChunks = $derived(bgChunks.filter(bgChunk => datesEqual(bgChunk.date, date)));

    let isToday = $derived(datesEqual(date, $_today));
    let highlight = $derived($highlightedDates.some(d => datesEqual(d, date)));
    let disabled = $derived(outsideRange(date, $validRange));

    // dateFromPoint
    onMount(() => {
        setPayload(el, () => ({
            allDay: true,
            date,
            resource,
            dayEl: el,
            disabled
        }));
    });

    export function reposition() {
        if (!disabled) {
            runReposition(refs, dayChunks);
        }
    }
</script>

<div
    bind:this={el}
    class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}{isToday ? ' ' + $theme.today : ''}{highlight ? ' ' + $theme.highlight : ''}{disabled ? ' ' + $theme.disabled : ''}"
    role="cell"
    onpointerdown={!disabled ? $_interaction.action?.select : undefined}
>
    <div class="{$theme.bgEvents}">
        {#if !disabled}
            {#each dayBgChunks as chunk (chunk.event)}
                <Event {chunk}/>
            {/each}
        {/if}
    </div>
    <!-- Drag, Resize & Select -->
    {#if iChunks[0] && datesEqual(iChunks[0].date, date) && !disabled}
        <div class="{$theme.events} {$theme.preview}">
            <Event chunk={iChunks[0]}/>
        </div>
    {/if}
    <div class="{$theme.events}">
        {#if !disabled}
            {#each dayChunks as chunk, i (chunk.event)}
                <!-- svelte-ignore binding_property_non_reactive -->
                <Event {chunk} {longChunks} bind:this={refs[i]}/>
            {/each}
        {/if}
    </div>
</div>
