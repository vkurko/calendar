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
  import { groupEventChunks } from "./events";
  import Event from "./Event.svelte";

  export let date;
  export let resource = undefined;

  let {
    _events,
    _iEvents,
    dateClick,
    highlightedDates,
    nowIndicator,
    slotDuration,
    slotHeight,
    _view,
    theme,
    _interaction,
  } = getContext("state");

  let { _slotTimeLimits } = getContext("view-state");

  let el;
  let chunks,
    iChunks = [];
  let today = setMidnight(createDate()),
    isToday,
    highlight;

  let start, end;

  $: {
    start = addDuration(cloneDate(date), $_slotTimeLimits.min);
    end = addDuration(cloneDate(date), $_slotTimeLimits.max);
  }

  $: {
    chunks = [];

    for (let event of $_events.filter((e) => e.isAllDay)) {
      if (intersects(event)) {
        let chunk = createEventChunk(event, start, end);

        let startMidnight = setMidnight(new Date(event.start));
        if (datesEqual(date, startMidnight)) {
          chunks.push(chunk);
        }
      }
    }

    groupEventChunks(chunks);
  }

  $: iChunks = $_iEvents.map((event) =>
    event && intersects(event) ? createEventChunk(event, start, end) : null
  );

  $: {
    isToday = datesEqual(date, today);
    highlight = $highlightedDates.some((d) => datesEqual(d, date));
  }

  function createClickHandler(fn) {
    return is_function(fn)
      ? (jsEvent) => {
          let r = rect(el);
          let y = jsEvent.clientY - r.top;
          let d = addDuration(
            cloneDate(date),
            $slotDuration,
            Math.floor(
              y / $slotHeight +
                $_slotTimeLimits.min.seconds / $slotDuration.seconds
            )
          );
          fn({
            date: toLocalDate(d),
            dateStr: toISOString(d),
            dayEl: el,
            jsEvent,
            view: toViewWithLocalDates($_view),
            resource,
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

  function intersects(event) {
    return (
      event.start < end &&
      event.end > start &&
      (resource === undefined || event.resourceIds.includes(resource.id))
    );
  }
</script>

<div
  bind:this={el}
  style="overflow:visible;"
  class="{$theme.day}{isToday ? ' ' + $theme.today : ''}{highlight
    ? ' ' + $theme.highlight
    : ''}"
  on:click={createClickHandler($dateClick)}
  on:pointerenter={createPointerEnterHandler($_interaction)}
  on:pointerleave={createPointerLeaveHandler($_interaction)}
>
  <div
    class={$theme.events}
    style="display:flex;height:100%;    flex-direction: column;
  "
  >
    <!-- Pointer -->
    {#if iChunks[1]}
      <Event {date} chunk={iChunks[1]} />
    {/if}
    <!-- 
        columnbs: []
        end: []
       -->
    {#each chunks as chunk}
      <Event {date} {chunk} />
    {/each}
    <!-- Drag & Resize -->
    {#if iChunks[0]}
      <Event {date} chunk={iChunks[0]} />
    {/if}
  </div>
</div>
