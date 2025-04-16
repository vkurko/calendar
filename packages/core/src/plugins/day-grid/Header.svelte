<script>
    import {getContext} from 'svelte';
    import {setContent} from '#lib';

    let {theme, _intlDayHeader, _intlDayHeaderAL, _days} = getContext('state');
</script>

<div class="{$theme.header}">
    <div class="{$theme.days}" role="row">
        {#each $_days as day}
            <div class="{$theme.day} {$theme.weekdays?.[day.getUTCDay()]}" role="columnheader">
                <span
                    aria-label="{$_intlDayHeaderAL.format(day)}"
                    use:setContent={$_intlDayHeader.format(day)}
                ></span>
            </div>
        {/each}
    </div>
    <div class="{$theme.hiddenScroll}"></div>
</div>
