<script>
    import {getContext} from 'svelte';
    import {setContent, toISOString} from '@event-calendar/core';

    let {_headerEl, _intlDayHeader, _dayTimes, _viewDates, theme} = getContext('state');
</script>

<div class="{$theme.header}" bind:this={$_headerEl}>
    <div class="{$theme.days}" role="row">
        {#each $_viewDates as date}
            <div class="{$theme.day} {$theme.weekdays?.[date.getUTCDay()]}">
                <div class="{$theme.dayHead}">
                    <time
                        datetime="{toISOString(date, 10)}"
                        use:setContent={$_intlDayHeader.format(date)}
                    ></time>
                </div>
                <div class="{$theme.times}">
                    {#each $_dayTimes[date.getTime()] as time}
                        <div class="{$theme.time}" aria-label="{time[3]}" role="columnheader">
                        <time
                            datetime="{time[0]}"
                            use:setContent={time[1]}
                        ></time>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    <div class="{$theme.hiddenScroll}"></div>
</div>
