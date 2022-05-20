<script>
  import { getContext } from "svelte";
  import { is_function } from "svelte/internal";
  import {
    createDate,
    cloneDate,
    addDuration,
    setMidnight,
    toLocalDate,
    datesEqual,
    createEventChunk,
    toViewWithLocalDates,
    rect,
    toISOString,
  } from "@event-calendar/common";
  import AllDayEvent from "./AllDayEvent.svelte";

  export let date;
  export let resource = undefined;
  export let chunks;
  export let longChunks;
  export let iChunks = [];

  let {
    _events,
    _iEvents,
    dateClick,
    highlightedDates,
    slotDuration,
    slotHeight,
    _view,
    theme,
    _interaction,
  } = getContext("state");

  let { _slotTimeLimits } = getContext("view-state");

  let el;
  let dayChunks;
  let today = setMidnight(createDate()),
    isToday,
    highlight;

  $: {
    dayChunks = [];
    for (let chunk of chunks) {
      if (datesEqual(chunk.date, date)) {
        dayChunks.push(chunk);
        // if ($dayMaxEvents !== false && dayChunks.length > $dayMaxEvents) {
        // 	chunk.hidden = true;
        // }
      }
    }
  }

  $: {
    isToday = datesEqual(date, today);
    highlight = $highlightedDates.some((d) => datesEqual(d, date));
  }

  function createClickHandler(fn) {
    return is_function(fn)
      ? (jsEvent) => {
          !jsEvent.ecClosingPopup &&
            fn({
              date: toLocalDate(date),
              dateStr: toISOString(date),
              dayEl: el,
              jsEvent,
              view: toViewWithLocalDates($_view),
            });
        }
      : undefined;
  }
  function createPointerEnterHandler(interaction) {
    return interaction.pointer
      ? (jsEvent) =>
          interaction.pointer.enterTimeGrid(
            date,
            el,
            jsEvent,
            _slotTimeLimits,
            resource
          )
      : undefined;
  }

  function createPointerLeaveHandler(interaction) {
    return interaction.pointer ? interaction.pointer.leave : undefined;
  }
</script>

<div
  bind:this={el}
  style="position: relative;min-height: 1em;"
  class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight
    ? ' ' + $theme.highlight
    : ''}"
  on:click={createClickHandler($dateClick)}
  on:pointerenter={createPointerEnterHandler($_interaction)}
  on:pointerleave={createPointerLeaveHandler($_interaction)}
>
  {#if iChunks[1] && datesEqual(iChunks[1].date, date)}
    <div class={$theme.events}>
      <AllDayEvent chunk={iChunks[1]} />
    </div>
  {/if}

  {#if iChunks[0] && datesEqual(iChunks[0].date, date)}
    <div class="{$theme.events} {$theme.preview}">
      <AllDayEvent chunk={iChunks[0]} />
    </div>
  {/if}

  <div class={$theme.events}>
    {#each dayChunks as chunk}
      <AllDayEvent {date} {chunk} {longChunks} />
    {/each}
  </div>
</div>
