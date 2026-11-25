import {
    afterNextRender, ChangeDetectionStrategy, Component, contentChildren, DestroyRef, Directive, effect, ElementRef,
    EmbeddedViewRef, inject, input, NgZone, TemplateRef, untracked, ViewContainerRef
} from '@angular/core';
import {createCalendar, destroyCalendar, type Calendar} from '@event-calendar/core';

export * from '@event-calendar/core';

/** The arguments of the options whose content can be rendered by a template */
export interface ContentContext {
    allDayContent: Calendar.AllDayContentArg;
    dayCellContent: Calendar.DayCellContentArg;
    eventContent: Calendar.EventContentInfo;
    moreLinkContent: Calendar.MoreLinkInfo;
    noEventsContent: {};
    resourceLabelContent: Calendar.ResourceLabelInfo;
    weekNumberContent: Calendar.WeekNumberContentArg;
}

/** The name of a content option, or of a toolbar item: `customButton` followed by its name with the first letter capitalized */
export type ContentName = keyof ContentContext | `customButton${string}`;

type Context<K> = K extends keyof ContentContext ? ContentContext[K] & {$implicit: ContentContext[K]} : {};

// Callbacks that the calendar only calls, they are run inside the Angular zone
const CALLBACKS = (
    'dateClick datesSet eventAllUpdated eventClick eventDidMount eventDragStart eventDragStop eventDrop ' +
    'eventMouseEnter eventMouseLeave eventResize eventResizeStart eventResizeStop loading noEventsClick ' +
    'resourceExpand resourceLabelDidMount select unselect viewDidMount'
).split(' ');

// An element of the calendar a template is rendered into
interface Outlet {
    name: string;
    arg: object;
    live: boolean;
    changed: boolean;
    view?: EmbeddedViewRef<any>;
    template?: TemplateRef<any>;
}

/**
 * A template that renders the content of the option with the given name, inside the same element:
 *
 *     <ng-template ecContent="eventContent" let-event="event" let-timeText="timeText">...</ng-template>
 */
@Directive({selector: 'ng-template[ecContent]'})
export class EcContent<K extends ContentName> {
    readonly name = input.required<K>({alias: 'ecContent'});
    readonly template = inject<TemplateRef<Context<K>>>(TemplateRef);

    static ngTemplateContextGuard<K extends ContentName>(directive: EcContent<K>, context: unknown): context is Context<K> {
        return true;
    }
}

/** The calendar. Its methods are available on the component after it is rendered. */
@Component({
    selector: 'event-calendar',
    template: '',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendar {
    readonly plugins = input.required<Calendar.Plugin[]>();
    readonly options = input<Calendar.Options>({});
    readonly templates = contentChildren(EcContent);

    #el: HTMLElement = inject(ElementRef).nativeElement;
    #views = inject(ViewContainerRef);
    #zone = inject(NgZone);
    #calendar?: Calendar;
    // The options given to the calendar and the functions among them, which stay the same when the options change
    #current: Record<string, any> = {};
    #stable: Record<string, any> = {};
    #outlets = new Map<HTMLElement, Outlet>();
    #scheduled = false;

    constructor() {
        afterNextRender(() => {
            this.#current = untracked(() => this.#collect());
            this.#calendar = this.#zone.runOutsideAngular(
                () => createCalendar(this.#el, untracked(this.plugins), this.#current)
            );
            Object.assign(this, this.#calendar);
        });

        effect(() => {
            let next = this.#collect();
            let calendar = this.#calendar;
            if (calendar) {
                // Set the options that did change
                let prev = this.#current;
                this.#current = next;
                this.#zone.runOutsideAngular(() => {
                    for (let name in {...prev, ...next}) {
                        if (prev[name] !== next[name]) {
                            calendar.setOption(name as keyof Calendar.Options, next[name]);
                        }
                    }
                });
            }
        });

        inject(DestroyRef).onDestroy(() => {
            if (this.#calendar) {
                destroyCalendar(this.#calendar);
                this.#calendar = undefined;
            }
        });
    }

    /** Create the options of the calendar from the given options and the templates */
    #collect() {
        let options: Record<string, any> = {...this.options()};
        for (let name of CALLBACKS) {
            if (typeof options[name] == 'function') {
                options[name] = this.#stable[name] ??= (...args: any[]) => this.#zone.run(
                    () => (this.options() as Record<string, any>)[name]?.(...args)
                );
            }
        }
        for (let directive of this.templates()) {
            let name: string = directive.name();
            if (name.startsWith('customButton')) {
                // The template of a toolbar item
                let button = name[12].toLowerCase() + name.slice(13);
                let item = this.#stable[name] ??= {};
                if (!item.to || item.from !== options['customButtons']) {
                    item.from = options['customButtons'];
                    item.to = {...item.from, [button]: {...item.from?.[button], content: this.#content(name)}};
                }
                options['customButtons'] = item.to;
            } else {
                options[name] = this.#stable['content:' + name] ??= this.#content(name);
            }
        }
        return options;
    }

    /** Create the content function for the calendar, which returns the function that receives the element */
    #content(name: string) {
        return (arg: object = {}) => (el: HTMLElement) => {
            let outlet = this.#outlets.get(el);
            if (outlet) {
                Object.assign(outlet, {name, arg, live: true, changed: true});
            } else {
                this.#outlets.set(el, outlet = {name, arg, live: true, changed: true});
            }
            this.#schedule();
            let current = outlet;

            return () => {
                current.live = false;
                this.#schedule();
            };
        };
    }

    /**
     * Render the templates in one go and inside the Angular zone, so that the events inside them are detected.
     * It is done in a microtask, which is before the calendar measures the content.
     */
    #schedule() {
        if (!this.#scheduled) {
            this.#scheduled = true;
            queueMicrotask(() => {
                this.#scheduled = false;
                this.#zone.run(() => this.#render());
            });
        }
    }

    #render() {
        let templates = untracked(this.templates);
        for (let [el, outlet] of this.#outlets) {
            let {name, arg, view} = outlet;
            let template = outlet.live
                ? templates.find(directive => directive.name() == name)?.template
                : undefined;
            if (view && outlet.template != template) {
                view.destroy();
                view = undefined;
            }
            if (!template) {
                // The element is no longer used for the content of a template
                this.#outlets.delete(el);
                continue;
            }
            let context = {...arg, $implicit: arg};
            if (view) {
                if (outlet.changed) {
                    Object.assign(view.context, context);
                }
            } else {
                // The element can still hold the content rendered by the calendar
                el.textContent = '';
                view = this.#views.createEmbeddedView(template, context);
                el.append(...view.rootNodes);
            }
            outlet.view = view;
            outlet.template = template;
            if (outlet.changed) {
                outlet.changed = false;
                view.detectChanges();
            }
        }
    }
}

// The methods of the calendar
export interface EventCalendar extends Calendar {}
