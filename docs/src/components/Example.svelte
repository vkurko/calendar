<script>
    import {Calendar, DayGrid, TimeGrid, List, ResourceTimeGrid, ResourceTimeline, Interaction} from '@event-calendar/core';
    import {examples} from '../examples/index.mjs';
    import {optionDemos} from '../examples/option-demos.mjs';
    import {methodDemos} from '../examples/method-demos.mjs';
    import {
        addDays, currentWeek, sampleEvents, sampleMeetings, samplePeople, sampleResources, startOfToday, time
    } from '../examples/data.mjs';

    const PLUGINS = {DayGrid, TimeGrid, List, ResourceTimeGrid, ResourceTimeline, Interaction};

    // Either an example by its `slug`, or the demo of an `option` where its value is switched.
    // `mini` is a preview that is not interactive, `height` is the height of the calendar.
    // Or the demo of a `method` with buttons that call it.
    let {slug, option, method, mini = false, height = '560px'} = $props();

    const demo = optionDemos[option] ?? methodDemos[method];
    const example = demo
        ? {plugins: Object.keys(PLUGINS), options: demo.base}
        : examples.find(example => example.slug === slug);

    let ec = $state();
    let root = $state();
    let lines = $state([]);

    function format(value) {
        if (value instanceof Date) {
            return value.toLocaleString('en', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'});
        }
        if (Array.isArray(value)) {
            return `an array of ${value.length}`;
        }
        if (value?.title && value.start) {
            return `the event “${value.title}”`;
        }
        return typeof value == 'object' && value ? JSON.stringify(value) : String(value);
    }

    // Call the method and show what it returns
    function call(action) {
        let result = action.run(ec, context, root);
        if (result === undefined) {
            context.log(action.label);
        } else {
            context.log(action.label, '→', result);
        }
    }

    // The options are created before the calendar, so the instance is reached through a proxy
    const context = {
        events: sampleEvents(),
        resources: sampleResources(),
        people: samplePeople(),
        meetings: sampleMeetings(),
        today: startOfToday(),
        addDays,
        time,
        week: currentWeek(),
        ec: new Proxy({}, {get: (_, method) => (...args) => ec[method](...args)}),
    };
    // Whether the example writes to the log is known by its taking `log` from the context
    // (the text of the function cannot tell it: the names are changed in the built site)
    let usesLog = false;
    let write = (...args) => lines = [args.map(format).join(' '), ...lines].slice(0, 5);
    Object.defineProperty(context, 'log', {get: () => (usesLog = true, write)});

    // The content defined by the example, rendered as HTML here and by each framework in the shown code
    let content = {};
    for (let [name, spec] of Object.entries(example.content ?? {})) {
        if (spec.render) {
            content[name] = arg => ({html: spec.render(arg)});
        } else {
            let render = new Function(...spec.args, 'return `' + spec.body.replace(/\{\{(.+?)\}\}/g, '${$1}') + '`');
            content[name] = arg => ({html: render(...spec.args.map(key => arg[key]))});
        }
    }

    let own = example.options(context);
    let options = {height: demo?.height ?? height, ...own, ...content};

    // The values of the option to switch between
    let values = (typeof demo?.values == 'function' ? demo.values(context) : demo?.values ?? []).map(
        item => item && typeof item == 'object' && 'label' in item && 'value' in item
            ? item
            : {label: typeof item == 'function' ? 'function' : JSON.stringify(item)?.replace(/"/g, "'") ?? 'undefined', value: item}
    );
    let selected = $state(0);
    let version = $state(0);
    let hinted = $state(0);
    if (values.length && values[0].value !== undefined) {
        options[option] = values[0].value;
    }
    if (demo?.callback) {
        // What the callback was called with, in short
        let time = format;
        options[option] = info => context.log(option, typeof info != 'object' ? info : [
            info.event?.title,
            info.resource?.title,
            info.date && time(info.date),
            info.start && time(info.start) + ' – ' + time(info.end),
            !info.event && !info.date && info.view?.type
        ].filter(Boolean).join(' · '));
    }

    function choose(i) {
        selected = i;
        // Draw attention to what has to be done to see the difference
        ++hinted;
        if (demo.remount) {
            options = {...options, [option]: values[i].value};
            ++version;
        } else {
            ec.setOption(option, values[i].value);
        }
    }

    if (mini) {
        // The toolbar is reduced to the title, unless the toolbar is what the example is about
        if (!('headerToolbar' in own) && !('buttonText' in own)) {
            options.headerToolbar = {start: 'title', center: '', end: ''};
        }
        // In a preview the events themselves are more telling than the links to them
        options.dayMaxEvents = false;
        options.slotHeight = 12;
    }
    let logs = demo ? demo.callback || demo.logs || demo.actions : usesLog;

    // Each selector of the styles gets the class of this example in front of it
    function scoped(css) {
        return css.replace(/\/\*.*?\*\//gs, '').replace(/([^{}]+)\{/g, (match, selectors) =>
            selectors.split(',').map(selector => `.example-${slug} ${selector.trim()}`).join(', ') + ' {'
        );
    }

    // Follow the theme of the site
    let dark = $state(false);
    $effect(() => {
        let root = document.documentElement;
        let update = () => dark = root.dataset.theme === 'dark';
        update();
        let observer = new MutationObserver(update);
        observer.observe(root, {attributes: true, attributeFilter: ['data-theme']});
        return () => observer.disconnect();
    });
</script>

{#if example.css}
    <!-- The styles of the example, the same that are shown in its code, limited to this example -->
    {@html `<style>${scoped(example.css)}</style>`}
{/if}
<div bind:this={root} class={['example not-content', slug && `example-${slug}`, mini && 'example-mini', dark && 'ec-dark']} inert={mini}>
    {#if values.length || demo?.note || demo?.actions}
        <div class="example-controls">
            {#each demo.actions ?? [] as action}
                <button type="button" class="action" onclick={() => call(action)}>{action.label}</button>
            {/each}
            {#if values.length}
                <code>{option}</code>
                {#each values as {label}, i}
                    <button type="button" class={{active: i === selected}} onclick={() => choose(i)}>{label}</button>
                {/each}
            {/if}
            {#if demo?.note}
                {#key hinted}
                    <span class={{hinted}}>{demo.note}</span>
                {/key}
            {/if}
        </div>
    {/if}
    <div class="example-calendar">
        {#key version}
            <Calendar bind:this={ec} plugins={example.plugins.map(name => PLUGINS[name])} {options} />
        {/key}
    </div>
    {#if logs && !mini}
        <div class="example-log" aria-live="polite">
            {#each lines as line, i (lines.length - i)}
                <div>{line}</div>
            {:else}
                <div class="example-log-empty">
                    {demo?.actions ? 'Press a button — what the method returns is shown here' : 'Interact with the calendar — the callbacks are logged here'}
                </div>
            {/each}
        </div>
    {/if}
</div>
