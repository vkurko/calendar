<script>
  import { getContext } from "svelte";
  import { cloneDate, addDay } from "@event-calendar/common";
  import { createEventChunk } from "@event-calendar/common";
  import { prepareEventChunks } from "./events";
  import AllDay from "./AllDay.svelte";

  export let dates;
  export let resource = undefined;
  export let loops;

  let { _events, _iEvents, hiddenDays } = getContext("state");

  let chunks,
    longChunks,
    iChunks = [];

  let start;
  let end;

  $: {
    start = dates[0];
    end = addDay(cloneDate(dates[dates.length - 1]));
  }

  $: {
    chunks = [];
    for (let event of $_events.filter((e) => e.allDay)) {
      if (event.display !== "background" && intersects(event)) {
        let chunk = createEventChunk(event, start, end);
        chunks.push(chunk);
      }
    }
    longChunks = prepareEventChunks(chunks, $hiddenDays);
  }

  $: iChunks = $_iEvents.map((event) => {
    let chunk;
    if (event && intersects(event)) {
      chunk = createEventChunk(event, start, end);
      prepareEventChunks([chunk], $hiddenDays);
    } else {
      chunk = null;
    }
    return chunk;
  });

  function intersects(event) {
    return (
      event.start < end &&
      event.end > start &&
      (resource === undefined || event.resourceIds.includes(resource.id))
    );
  }
</script>

{#each dates as date}
  <AllDay {date} {chunks} {longChunks} {iChunks} {resource} />
{/each}
