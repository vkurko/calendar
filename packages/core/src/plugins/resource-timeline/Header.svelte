<script>
    import {getContext} from 'svelte';
    import {setContent, toISOString, toSeconds, observeResize} from '#lib';

    let {_headerEl, _headerHeight,_intlDayHeader, _intlDayHeaderAL, _dayTimes, _viewDates, slotDuration, theme} = getContext('state');
</script>

<div class="{$theme.header}" bind:this={$_headerEl} use:observeResize={() => $_headerHeight = $_headerEl.clientHeight}>
    <div class="{$theme.days}" role="row">
        {#each $_viewDates as date}
            <div class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}">
                {#if toSeconds($slotDuration)}
                    <div class="{$theme.dayHead}">
                        <time
                            datetime="{toISOString(date, 10)}"
                            aria-label="{$_intlDayHeaderAL.format(date)}"
                            use:setContent={$_intlDayHeader.format(date)}
                        ></time>
                    </div>
                    <div class="{$theme.times}">
                        {#each $_dayTimes[date.getTime()] as time}
                            <div class="{$theme.time}{time[2] ? '' : ' ' + $theme.minor}" role="columnheader">
                                <time
                                    datetime="{time[0]}"
                                    use:setContent={time[1]}
                                ></time>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="{$theme.time}" role="columnheader">
                        <time
                            datetime="{toISOString(date, 10)}"
                            aria-label="{$_intlDayHeaderAL.format(date)}"
                            use:setContent={$_intlDayHeader.format(date)}
                        ></time>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    <div class="{$theme.hiddenScroll}"></div>
</div>
