<script>
  import { getContext, setContext } from "svelte";
  import State from "./state";
  import Header from "./Header.svelte";
  import Body from "./Body.svelte";
  import Day from "./Day.svelte";
  import AllDayBody from "./AllDayBody.svelte";
  import AllDayOverview from "./AllDayOverview.svelte";

  let state = getContext("state");
  let { _viewDates, _intlDayHeader, _viewClass, theme } = state;

  setContext("view-state", new State(state));

  $_viewClass = "week";
</script>

<Header>
  {#each $_viewDates as date}
    <div class={$theme.day}>{$_intlDayHeader.format(date)}</div>
  {/each}
</Header>

<AllDayBody>
  <AllDayOverview dates={$_viewDates} />
</AllDayBody>

<Body>
  {#each $_viewDates as date}
    <Day {date} />
  {/each}
</Body>
