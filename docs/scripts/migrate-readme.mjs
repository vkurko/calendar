import fs from 'node:fs';
import path from 'node:path';
import {examples, groups as exampleGroups} from '../src/examples/index.mjs';
import {optionDemos} from '../src/examples/option-demos.mjs';
import {methodDemos} from '../src/examples/method-demos.mjs';
import {CONTENT_EXAMPLES} from '../src/examples/content-examples.mjs';

const ROOT = new URL('../..', import.meta.url).pathname;
const OUT = path.join(ROOT, 'docs/src/content/docs');
const SRC = path.join(ROOT, 'docs/src');
const REPO = 'https://github.com/vkurko/calendar/blob/master/';

const {version} = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const lines = readme.split('\n');

// --- GitHub-style slugger with dedup (mirrors github-slugger) ---
function makeSlugger() {
    const seen = new Map();
    return text => {
        let slug = text
            .toLowerCase()
            .trim()
            .replace(/[^\w\- ]/g, '')
            .replace(/ /g, '-');
        const n = seen.get(slug) ?? 0;
        seen.set(slug, n + 1);
        return n ? `${slug}-${n}` : slug;
    };
}

// --- Parse README into ## sections with ### subsections, tracking code fences ---
const sections = [];
let cur = null, sub = null, inFence = false;
for (const line of lines) {
    if (/^(```|~~~)/.test(line.trim())) inFence = !inFence;
    if (!inFence && /^## /.test(line)) {
        cur = {title: line.slice(3).trim(), intro: [], subs: []};
        sub = null;
        sections.push(cur);
        continue;
    }
    if (!inFence && /^### /.test(line) && cur) {
        sub = {title: line.slice(4).trim(), lines: []};
        cur.subs.push(sub);
        continue;
    }
    if (!cur) continue;
    (sub ? sub.lines : cur.intro).push(line);
}

// --- Page layout: section title -> output page slug ---
const PAGE = {
    'Usage': 'usage',
    'Options': 'options',
    'Methods': 'methods',
    'Content': 'content',
    'Event object': 'event-object',
    'Duration object': 'duration-object',
    'Resource object': 'resource-object',
    'View object': 'view-object',
    'Theming': 'theming',
    'Browser support': 'browser-support',
};

// Pages maintained by hand in the site (still valid link targets, but not generated)
const HAND_WRITTEN = new Set(['usage']);

// --- Sidebar groups for options ---
const CATEGORIES = {
    'Calendar & views': [
        'customScrollbars', 'date', 'dateIncrement', 'datesSet', 'duration', 'firstDay',
        'height', 'hiddenDays', 'highlightedDates', 'locale', 'theme', 'timeZone',
        'titleFormat', 'validRange', 'view', 'viewDidMount', 'views', 'weekNumberContent',
        'weekNumbers',
    ],
    'Header toolbar': [
        'buttonText', 'customButtons', 'headerToolbar', 'icons',
    ],
    'Time grid & slots': [
        'allDayContent', 'allDaySlot', 'columnWidth', 'dayHeaderAriaLabelFormat',
        'dayHeaderFormat', 'flexibleSlotTimeLimits', 'monthHeaderFormat', 'nowIndicator',
        'scrollTime', 'slotDuration', 'slotEventOverlap', 'slotHeight', 'slotLabelFormat',
        'slotLabelInterval', 'slotMaxTime', 'slotMinTime', 'slotWidth', 'snapDuration',
    ],
    'Day grid': [
        'dayCellContent', 'dayCellFormat', 'dayMaxEvents', 'dayPopoverFormat', 'moreLinkContent',
    ],
    'List view': [
        'listDayFormat', 'listDaySideFormat', 'noEventsClick', 'noEventsContent',
    ],
    'Events': [
        'displayEventEnd', 'events', 'eventAllUpdated', 'eventBackgroundColor',
        'eventClassNames', 'eventColor', 'eventContent', 'eventDidMount', 'eventFilter', 'eventGap',
        'eventOrder', 'eventOrderStrict', 'eventSources', 'eventTextColor', 'eventTimeFormat', 'lazyFetching',
        'loading',
    ],
    'Clicking & hovering': [
        'dateClick', 'eventClick', 'eventMouseEnter', 'eventMouseLeave', 'pointer',
    ],
    'Drag, drop & resize': [
        'dragConstraint', 'dragScroll', 'editable', 'eventDragMinDistance', 'eventDragStart',
        'eventDragStop', 'eventDrop', 'eventDurationEditable', 'eventLongPressDelay',
        'eventResizableFromStart', 'eventResize', 'eventResizeStart', 'eventResizeStop',
        'eventStartEditable', 'longPressDelay', 'resizeConstraint',
    ],
    'Selection': [
        'select', 'selectable', 'selectBackgroundColor', 'selectConstraint',
        'selectLongPressDelay', 'selectMinDistance', 'unselect', 'unselectAuto',
        'unselectCancel',
    ],
    'Resources': [
        'datesAboveResources', 'filterEventsWithResources', 'filterResourcesWithEvents',
        'refetchResourcesOnNavigate', 'resourceExpand', 'resources', 'resourcesInitiallyExpanded',
        'resourceLabelContent', 'resourceLabelDidMount',
    ],
};

// --- Examples of the content options for each framework (page becomes .mdx) ---
// `args` are the properties of the argument used in the example, `body` is the markup, where {{x}} is a value

// Labels of the tabs are the same on all pages, so that the choice is synced
const TABS_IMPORT = `import { Tabs, TabItem } from '@astrojs/starlight/components';\n\n`;
function tabs(items) {
    return '<Tabs syncKey="framework">\n'
        + Object.entries(items).map(([label, text]) => `<TabItem label="${label}">\n\n${text.trim()}\n\n</TabItem>`).join('\n')
        + '\n</Tabs>';
}
const code = (lang, text) => '```' + lang + '\n' + text + '\n```';

function contentExamples(name) {
    const {args, body} = CONTENT_EXAMPLES[name];
    const arg = args.length ? `{${args.join(', ')}}` : '';
    // The markup can take several lines, which are indented as the place they are put into
    const rows = (text, spaces) => text.split('\n').map(row => ' '.repeat(spaces) + row).join('\n');
    const single = body.replace(/\{\{(.+?)\}\}/g, '{$1}');
    const double = body.replace(/\{\{(.+?)\}\}/g, '{{ $1 }}');
    const html = body.replace(/\{\{(.+?)\}\}/g, '${$1}').replace(/\n/g, '');
    const jsx = single.replace(/ class=/g, ' className=').replace(/<br>/g, '<br/>');
    const js = code('js', html.length > 60
        ? `let options = {\n    ${name}: (${arg}) => ({\n        html: \`${html}\`\n    })\n};`
        : `let options = {\n    ${name}: (${arg}) => ({html: \`${html}\`})\n};`);
    const lets = args.map(a => ` let-${a}="${a}"`).join('');
    return tabs({
        'Vanilla JS': js,
        'Svelte': code('svelte', `<Calendar {plugins} {options}>\n    {#snippet ${name}(${arg})}\n${rows(single, 8)}\n    {/snippet}\n</Calendar>`),
        'React': code('jsx', body.includes('\n')
            ? `<EventCalendar\n    plugins={plugins}\n    ${name}={(${arg}) => <>\n${rows(jsx, 8)}\n    </>}\n/>`
            : `<EventCalendar\n    plugins={plugins}\n    ${name}={(${arg}) => <>${jsx}</>}\n/>`),
        'Vue': code('vue', `<EventCalendar :plugins="plugins">\n    <template #${name}${arg ? `="${arg}"` : ''}>\n${rows(double, 8)}\n    </template>\n</EventCalendar>`),
        'Angular': code('html', `<event-calendar [plugins]="plugins" [options]="options">\n    <ng-template ecContent="${name}"${lets}>\n${rows(double, 8)}\n    </ng-template>\n</event-calendar>`),
        'CDN': js,
    });
}

// --- Sidebar groups for methods ---
const METHOD_GROUPS = {
    'Options': ['getOption', 'setOption', 'setOptions'],
    'Events': ['addEvent', 'getEventById', 'getEvents', 'removeEventById', 'updateEvent', 'refetchEvents'],
    'Resources': ['refetchResources'],
    'Navigation & view': ['gotoDate', 'next', 'prev', 'getView', 'dateFromPoint'],
    'Selection': ['unselect'],
};

// getOption( name ) -> getoption
const methodSlug = title => title.split('(')[0].trim().toLowerCase();

// --- Build anchor map: README anchor -> {page, frag} ---
const anchors = new Map();
const globalSlug = makeSlugger();
const pageSluggers = new Map();
const pageSlug = (page, text) => {
    if (!pageSluggers.has(page)) pageSluggers.set(page, makeSlugger());
    return pageSluggers.get(page)(text);
};
for (const sec of sections) {
    const page = PAGE[sec.title];
    const secAnchor = globalSlug(sec.title);
    if (page) anchors.set(secAnchor, {page, frag: ''});
    for (const s of sec.subs) {
        const a = globalSlug(s.title);
        if (!page) continue;
        if (sec.title === 'Options') {
            anchors.set(a, {page: `options/${s.title.toLowerCase()}`, frag: ''});
        } else if (sec.title === 'Methods') {
            anchors.set(a, {page: `methods/${methodSlug(s.title)}`, frag: ''});
        } else if (HAND_WRITTEN.has(page)) {
            anchors.set(a, {page, frag: ''}); // hand-written page: sections may be reorganized
        } else {
            anchors.set(a, {page, frag: pageSlug(page, s.title)});
        }
    }
}

// Subsections of the hand-written pages that are linked from the README
anchors.set('content-snippets', {page: 'usage', frag: 'rendering-content'});
for (const anchor of ['rendering-content-with-react', 'rendering-content-with-slots', 'rendering-content-with-templates']) {
    anchors.set(anchor, {page: 'usage', frag: 'rendering-content'});
}

// --- Link rewriting ---
function rewriteLinks(text, srcPage) {
    text = text.replace(/\]\(#([^)]+)\)/g, (m, a) => {
        const t = anchors.get(a);
        if (!t) {
            console.warn(`  ! unresolved anchor #${a} on ${srcPage}`);
            return m;
        }
        if (t.page === srcPage) return `](#${t.frag || ''})`;
        let rel = path.posix.relative('/' + srcPage, '/' + t.page) + '/';
        return `](${rel}${t.frag ? '#' + t.frag : ''})`;
    });
    text = text.replace(/\]\(((?:packages|scripts)\/[^)]+|CHANGELOG\.md|CONTRIBUTING\.md|LICENSE)\)/g,
        (m, p) => `](${REPO}${p})`);
    return text;
}

function shiftHeadings(body) {
    const out = [];
    let fence = false;
    for (const line of body.split('\n')) {
        if (/^(```|~~~)/.test(line.trim())) fence = !fence;
        out.push(!fence && /^###/.test(line) ? line.replace(/^#/, '') : line);
    }
    return out.join('\n');
}

// First meaningful paragraph as a plain-text description for SEO
function extractDescription(body) {
    let fence = false;
    for (const line of body.split('\n')) {
        const t = line.trim();
        if (/^(```|~~~)/.test(t)) { fence = !fence; continue; }
        if (fence || !t || /^[-*#>]/.test(t) || /^</.test(t)) continue;
        let text = t
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/`([^`]*)`/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
        if (text.length > 160) {
            text = text.slice(0, 157).replace(/\s+\S*$/, '') + '…';
        }
        return text;
    }
    return '';
}

function writePage(relPath, title, body, {description = '', extraFm = ''} = {}) {
    const file = path.join(OUT, relPath);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    let fm = `---\ntitle: ${JSON.stringify(title)}\n`;
    if (description) fm += `description: ${JSON.stringify(description)}\n`;
    fm += extraFm + '---\n\n';
    fs.writeFileSync(file, fm + body.trim() + '\n');
    console.log('  ✓', relPath);
}

// --- Examples: the code of each one for every framework ---
const dedent = text => {
    const rows = text.split('\n');
    const indent = Math.min(...rows.filter(row => row.trim()).map(row => row.match(/^ */)[0].length));
    return rows.map(row => row.slice(indent)).join('\n');
};
const indentBy = (text, spaces) => text.split('\n').map((row, i) => i && row ? ' '.repeat(spaces) + row : row).join('\n');

// The source of the object the `options` function returns
function optionsSource(example) {
    const source = String(example.options);
    const body = source.slice(source.indexOf('=> (') + 4, source.lastIndexOf(')'));
    const rows = body.split('\n');
    // The first row starts right after the bracket, the others carry the indent of the examples file
    return [rows[0], ...dedent(rows.slice(1).join('\n')).split('\n')].join('\n');
}

function exampleCode(example) {
    const source = optionsSource(example);
    const usesEc = /\bec\./.test(source);
    const plugins = example.plugins.join(', ');
    const content = Object.entries(example.content ?? {});
    // The helpers and the data the options refer to
    const declare = (keyword = 'const') => [
        /\btoday\b|\bweek\[/.test(source) && `${keyword} today = new Date();`,
        /\baddDays\(|\bweek\[/.test(source) && `${keyword} addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);`,
        /\bweek\[/.test(source) && `// The days of the current week, from Sunday\n${keyword} week = [0, 1, 2, 3, 4, 5, 6].map(weekday => addDays(today, weekday - today.getDay()));`,
        /\btime\(/.test(source) && `// The date at the given time of the day\n${keyword} time = (date, hhmm) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...hhmm.split(':'));`,
        /\bresources\b(?!:)/.test(source) && `${keyword} resources = [/* your resources */];`,
        /\bpeople\b/.test(source) && `${keyword} people = [/* your resources */];`,
        /\bmeetings\b/.test(source) && `${keyword} meetings = [/* your events */];`,
        /\bevents\b(?!:)/.test(source) && `${keyword} events = [/* your events */];`,
    ].filter(Boolean);
    const lines = (rows, spaces = 0) => rows.length ? rows.map(row => ' '.repeat(spaces) + row).join('\n') + '\n' : '';
    const options = instance => source.replace(/\blog\(/g, 'console.log(').replace(/\bec\./g, instance + '.');
    // Add the content functions as the last properties of the options
    const withContent = (code, render) => content.length
        ? code.replace(/\n\}$/, ',\n' + content.map(([name, spec]) => '    ' + render(name, spec)).join(',\n') + '\n}')
        : code;
    const arg = spec => spec.args.length ? `{${spec.args.join(', ')}}` : '';
    // The markup of the content for a framework: written by hand for the rich examples, or made from `body`.
    // It can take several lines, which are indented as the place they are put into.
    const at = (text, spaces) => text.split('\n').map(row => ' '.repeat(spaces) + row).join('\n');
    const single = spec => spec.code?.svelte ?? spec.body.replace(/\{\{(.+?)\}\}/g, '{$1}');
    const double = (spec, framework) => spec.code?.[framework] ?? spec.body.replace(/\{\{(.+?)\}\}/g, '{{ $1 }}');
    const jsx = spec => spec.code?.react
        ?? single(spec).replace(/<br>/g, '<br/>').replace(/ class=/g, ' className=');
    // In plain JavaScript the content is HTML: the template of `render`, or `body`
    const jsContent = (name, spec) => {
        if (!spec.render) {
            return `${name}: (${arg(spec)}) => ({html: \`${spec.body.replace(/\{\{(.+?)\}\}/g, '${$1}')}\`})`;
        }
        const source = String(spec.render);
        const template = dedent(source.slice(source.indexOf('`') + 1, source.lastIndexOf('`')).replace(/^\n/, ''));
        return `${name}: (${arg(spec)}) => ({\n        html: \`\n${at(template, 12)}\n        \`\n    })`;
    };
    // Several elements of JSX need a fragment around them
    const jsxProp = (name, spec) => {
        const markup = jsx(spec);
        const one = /^<(\w+)[\s\S]*<\/\1>$/.test(markup.trim()) && !/\n<\w/.test(markup);
        return markup.includes('\n')
            ? `\n            ${name}={(${arg(spec)}) => (\n${at(one ? markup : '<>\n' + at(markup, 4) + '\n</>', 16)}\n            )}`
            : `\n            ${name}={(${arg(spec)}) => <>${markup}</>}`;
    };

    const vanilla = `import {createCalendar, ${plugins}} from '@event-calendar/core';
import '@event-calendar/core/index.css';

${lines(declare())}
const ec = createCalendar(document.getElementById('ec'), [${plugins}], ${withContent(options('ec'), jsContent)});`;

    const svelte = `<script>
    import {Calendar, ${plugins}} from '@event-calendar/core';

${lines(declare('let'), 4)}${usesEc ? '    let ec = $state();\n' : ''}    let options = $state(${indentBy(options('ec'), 4)});
</script>

<Calendar ${usesEc ? 'bind:this={ec} ' : ''}plugins={[${plugins}]} {options}${content.length ? '>\n'
        + content.map(([name, spec]) => `    {#snippet ${name}(${arg(spec)})}\n${at(single(spec), 8)}\n    {/snippet}`).join('\n')
        + '\n</Calendar>' : ' />'}`;

    const react = `import {${usesEc ? 'useRef' : ''}} from 'react';
import {EventCalendar, ${plugins}} from '@event-calendar/react';
import '@event-calendar/react/index.css';

const plugins = [${plugins}];
${lines(declare())}
export default function App() {
${usesEc ? '    const calendar = useRef(null);\n' : ''}    const options = ${indentBy(options('calendar.current'), 4)};

    return (
        <EventCalendar
            ${usesEc ? 'ref={calendar}\n            ' : ''}plugins={plugins}
            {...options}${content.map(([name, spec]) => jsxProp(name, spec)).join('')}
        />
    );
}`.replace("import {} from 'react';\n", '');

    const vue = `<script setup>
${usesEc ? "import {useTemplateRef} from 'vue';\n" : ''}import {EventCalendar, ${plugins}} from '@event-calendar/vue';
import '@event-calendar/vue/index.css';

const plugins = [${plugins}];
${lines(declare())}${usesEc ? "const calendar = useTemplateRef('calendar');\n" : ''}const options = ${options('calendar.value')};
</script>

<template>
    <EventCalendar ${usesEc ? 'ref="calendar" ' : ''}:plugins="plugins" :options="options"${content.length ? '>\n'
        + content.map(([name, spec]) => `        <template #${name}${arg(spec) ? `="${arg(spec)}"` : ''}>\n${at(double(spec, 'vue'), 12)}\n        </template>`).join('\n')
        + '\n    </EventCalendar>' : ' />'}
</template>`;

    const template = content.length
        ? '`\n        <event-calendar [plugins]="plugins" [options]="options">\n'
            + content.map(([name, spec]) => `            <ng-template ecContent="${name}"${spec.args.map(a => ` let-${a}="${a}"`).join('')}>\n${at(double(spec, 'angular'), 16)}\n            </ng-template>`).join('\n')
            + '\n        </event-calendar>`'
        : '`<event-calendar [plugins]="plugins" [options]="options" />`';
    const angular = `import {Component${usesEc ? ', viewChild' : ''}} from '@angular/core';
import {EventCalendar, EcContent, ${plugins}, type Calendar} from '@event-calendar/angular';

${lines(declare().map(row => row.replace(' events = ', ' events: Calendar.EventInput[] = ').replace(' meetings = ', ' meetings: Calendar.EventInput[] = ').replace(/ (resources|people) = /, ' $1: Calendar.ResourceInput[] = ')))}
@Component({
    selector: 'app-root',
    imports: [EventCalendar, EcContent],
    template: ${template}
})
export class App {
${usesEc ? '    calendar = viewChild.required(EventCalendar);\n' : ''}    plugins = [${plugins}];
    options: Calendar.Options = ${indentBy(options('this.calendar()'), 4)};
}`;

    const cdn = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build@${version}/dist/event-calendar.min.css">
<script src="https://cdn.jsdelivr.net/npm/@event-calendar/build@${version}/dist/event-calendar.min.js"></script>

<div id="ec"></div>

<script>
${lines(declare(), 4)}
    const ec = EventCalendar.create(document.getElementById('ec'), ${indentBy(withContent(options('ec'), jsContent), 4)});
</script>`;

    // No empty line is left where nothing is declared
    const tidy = text => text.replace(/\n{3,}/g, '\n\n').replace(/<script>\n\n/, '<script>\n');
    return tabs({
        'Vanilla JS': code('js', tidy(vanilla)),
        'Svelte': code('svelte', tidy(svelte)),
        'React': code('jsx', tidy(react)),
        'Vue': code('vue', tidy(vue)),
        'Angular': code('ts', tidy(angular)),
        'CDN': code('html', tidy(cdn)),
    });
}

// The options an example uses, which are the top-level properties of its options and the content it renders
function exampleOptions(example) {
    const names = new Set(Object.keys(example.content ?? {}));
    for (const m of optionsSource(example).matchAll(/^    (\w+)(?=[:,]|$)/gm)) names.add(m[1]);
    return [...names].filter(name => anchors.has(name.toLowerCase()) && anchors.get(name.toLowerCase()).page.startsWith('options/')).sort();
}

fs.rmSync(path.join(OUT, 'examples'), {recursive: true, force: true});
const examplesByOption = new Map();
for (const example of examples) {
    const used = exampleOptions(example);
    for (const name of used) {
        examplesByOption.set(name, [...(examplesByOption.get(name) ?? []), example]);
    }
    const body = TABS_IMPORT + `import Example from '../../../components/Example.svelte';\n\n`
        + example.description + '\n\n'
        + `<Example client:only="svelte" slug="${example.slug}" />\n\n`
        + '## Code\n\n' + exampleCode(example) + '\n\n'
        + (example.css ? '## Styles\n\n' + code('css', example.css) + '\n\n' : '')
        + '## Options used\n\n' + used.map(name => `- [${name}](../../options/${name.toLowerCase()}/)`).join('\n');
    writePage(`examples/${example.slug}.mdx`, example.title, body, {
        description: example.description.replace(/`/g, ''),
        extraFm: `sidebar:\n  order: ${examples.indexOf(example) + 1}\n`,
    });
}
// The gallery of all examples with live previews
writePage('examples/index.mdx', 'Examples',
    `import Example from '../../../components/Example.svelte';\n\n`
    + `${examples.length} live calendars with the code for every framework. Each one runs right on the page.\n\n`
    + exampleGroups.map(group => `## ${group}\n\n<div class="example-grid not-content">\n`
        + examples.filter(example => example.group === group).map(example =>
            `<a class="example-card" href="${example.slug}/">\n<div class="example-card-preview">`
            + `<Example client:visible slug="${example.slug}" mini height="204px" /></div>\n`
            + `<div class="example-card-text"><strong>${example.title}</strong>`
            + `<span>${example.description.replace(/`/g, '').split(/(?<=\.)\s/)[0]}</span></div>\n</a>`
        ).join('\n') + '\n</div>').join('\n\n'),
    {description: 'Live examples of EventCalendar with code for JavaScript, Svelte, React, Vue and Angular.',
        extraFm: 'sidebar:\n  label: All examples\n  order: 0\ntableOfContents: false\n'});

// Sidebar groups of the examples
fs.writeFileSync(path.join(SRC, 'examples-sidebar.mjs'),
    '// Generated by scripts/migrate-readme.mjs — do not edit by hand\n'
    + 'export default ' + JSON.stringify(exampleGroups.map(group => ({
        label: group,
        collapsed: true,
        items: examples.filter(example => example.group === group).map(example => `examples/${example.slug}`),
    })), null, 4) + ';\n');

// --- Emit pages ---
fs.rmSync(path.join(OUT, 'options'), {recursive: true, force: true});
fs.rmSync(path.join(OUT, 'methods.mdx'), {force: true});

const optionNames = [];
for (const sec of sections) {
    const page = PAGE[sec.title];
    if (!page || HAND_WRITTEN.has(page)) continue;

    if (sec.title === 'Options') {
        for (const s of sec.subs) {
            const slug = s.title.toLowerCase();
            optionNames.push(s.title);
            let body = rewriteLinks(s.lines.join('\n'), `options/${slug}`);
            // A page with a demo or with tabs is MDX around the text of the README, which stays a markdown file
            // (as MDX it is parsed stricter)
            let ext = 'md';
            const parts = [];
            if (optionDemos[s.title]) {
                parts.push(`## Demo\n\n<Example client:visible option="${s.title}" height="440px" />`);
            }
            if (CONTENT_EXAMPLES[s.title]) {
                parts.push('## Example\n\n' + contentExamples(s.title));
            }
            const related = examplesByOption.get(s.title);
            if (related) {
                parts.push('## Live examples\n\n'
                    + related.map(example => `- [${example.title}](../../examples/${example.slug}/)`).join('\n'));
            }
            if (parts.length) {
                ext = 'mdx';
                fs.mkdirSync(path.join(OUT, 'options'), {recursive: true});
                fs.writeFileSync(path.join(OUT, `options/_${slug}.md`), body.trim() + '\n');
                body = TABS_IMPORT + `import Example from '../../../components/Example.svelte';\n`
                    + `import {Content as Body} from './_${slug}.md';\n\n<Body />\n\n` + parts.join('\n\n');
            }
            writePage(`options/${slug}.${ext}`, s.title, body, {description: extractDescription(s.lines.join('\n'))});
        }
        const list = sec.subs.map(s => `- [${s.title}](${s.title.toLowerCase()}/)`).join('\n');
        writePage('options/index.md', 'Options',
            'The full list of available options.\n\n' + list,
            {description: 'The full list of EventCalendar options.', extraFm: 'sidebar:\n  label: Overview\n  order: 0\n'});
        continue;
    }

    let body = sec.intro.join('\n');
    for (const s of sec.subs) {
        body += `\n### ${s.title}\n` + s.lines.join('\n');
    }
    body = shiftHeadings(rewriteLinks(body, page));
    if (sec.title === 'Methods') {
        fs.rmSync(path.join(OUT, 'methods'), {recursive: true, force: true});
        fs.rmSync(path.join(OUT, 'methods.md'), {force: true});
        for (const s of sec.subs) {
            const slug = methodSlug(s.title);
            const name = s.title.split('(')[0].trim();
            let body = rewriteLinks(s.lines.join('\n'), `methods/${slug}`);
            let ext = 'md';
            if (methodDemos[name]) {
                ext = 'mdx';
                fs.mkdirSync(path.join(OUT, 'methods'), {recursive: true});
                fs.writeFileSync(path.join(OUT, `methods/_${slug}.md`), body.trim() + '\n');
                body = `import Example from '../../../components/Example.svelte';\n`
                    + `import {Content as Body} from './_${slug}.md';\n\n<Body />\n\n`
                    + `## Demo\n\n<Example client:visible method="${name}" height="400px" />`;
            }
            writePage(`methods/${slug}.${ext}`, s.title, body, {
                description: extractDescription(s.lines.join('\n')),
                extraFm: `sidebar:\n  label: ${name}\n`,
            });
        }
        // The groups of the sidebar and of the overview, a method that is in no group goes to the last one
        const methodNames = sec.subs.map(s => s.title.split('(')[0].trim());
        const grouped = Object.entries(METHOD_GROUPS).map(([label, names]) => [label, names.filter(n => methodNames.includes(n))]);
        const rest = methodNames.filter(n => !Object.values(METHOD_GROUPS).flat().includes(n));
        if (rest.length) {
            console.warn(`  ! ungrouped methods: ${rest.join(', ')}`);
            grouped.push(['Other', rest]);
        }
        fs.writeFileSync(path.join(SRC, 'methods-sidebar.mjs'),
            '// Generated by scripts/migrate-readme.mjs — do not edit by hand\n'
            + 'export default ' + JSON.stringify(grouped.map(([label, names]) => ({
                label, collapsed: true, items: names.map(n => `methods/${n.toLowerCase()}`),
            })), null, 4) + ';\n');
        const titleOf = name => sec.subs.find(s => s.title.split('(')[0].trim() === name).title;
        writePage('methods/index.md', 'Methods',
            'Methods are called on the calendar instance, see [how to get it](../usage/#calling-methods) '
            + 'in the flavor you are working with. In the examples the instance is named `ec`.\n\n'
            + grouped.map(([label, names]) => `## ${label}\n\n`
                + names.map(n => `- [${titleOf(n)}](${n.toLowerCase()}/)`).join('\n')).join('\n\n'),
            {description: 'The methods of the calendar instance.', extraFm: 'sidebar:\n  label: Overview\n  order: 0\n'});
        continue;
    }
    writePage(`${page}.md`, sec.title, body, {description: extractDescription(sec.intro.join('\n'))});
}

// --- Changelog page from CHANGELOG.md ---
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8')
    .replace(/^# .*\n/, '');
writePage('changelog.md', 'Changelog', changelog,
    {description: 'EventCalendar release history.'});

// --- Sidebar groups module for astro.config.mjs ---
const categorized = new Set();
const groups = [];
for (const [label, names] of Object.entries(CATEGORIES)) {
    for (const n of names) {
        if (!optionNames.includes(n)) console.warn(`  ! category "${label}" lists unknown option ${n}`);
        if (categorized.has(n)) console.warn(`  ! option ${n} categorized twice`);
        categorized.add(n);
    }
    groups.push({
        label,
        collapsed: true,
        items: names.filter(n => optionNames.includes(n)).map(n => `options/${n.toLowerCase()}`),
    });
}
const uncategorized = optionNames.filter(n => !categorized.has(n));
if (uncategorized.length) {
    console.warn(`  ! uncategorized options: ${uncategorized.join(', ')}`);
    groups.push({label: 'Other', collapsed: true, items: uncategorized.map(n => `options/${n.toLowerCase()}`)});
}
fs.writeFileSync(path.join(SRC, 'options-sidebar.mjs'),
    '// Generated by scripts/migrate-readme.mjs — do not edit by hand\n'
    + 'export default ' + JSON.stringify(groups, null, 4) + ';\n');
console.log('  ✓ ../options-sidebar.mjs');

// --- The version of the CDN bundle on the hand-written usage page follows the release ---
const usage = path.join(OUT, 'usage.mdx');
fs.writeFileSync(usage, fs.readFileSync(usage, 'utf8').replace(/@event-calendar\/build@[\d.]+/g, '@event-calendar/build@' + version));

console.log('Done. Anchors mapped:', anchors.size, '| options:', optionNames.length);
