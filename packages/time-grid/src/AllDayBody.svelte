<script>
  import { getContext } from "svelte";

  let { _scrollable, theme, _events } = getContext("state");
  let { _times } = getContext("view-state");
</script>

<div
  class="{$theme.header} {$theme.allDay} {$_scrollable
    ? ' ' + $theme.withScroll
    : ''}"
  style="display:flex;"
>
  <div class={$theme.sidebar}>
    <div class={$theme.time} style="top:0;">All</div>

    <div class={$theme.hiddenTimes}>
      {#each $_times as time}
        <div class={$theme.time}>{time}</div>
      {/each}
    </div>
  </div>
  <div style="display:flex;flex: 1 1 0%;">
    <div class={$theme.days}>
      <div class={$theme.lines} />
      <slot />
    </div>
  </div>
  <div class={$theme.hiddenScroll} />
</div>
