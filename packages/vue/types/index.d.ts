/// <reference lib="es6" />
/// <reference lib="dom" />
import type { AllowedComponentProps, ComponentCustomProps, VNodeProps } from "vue";
import type { Calendar } from "@event-calendar/core";

export * from "@event-calendar/core";

/** Options that are functions the calendar only calls, without using their result */
type CallbackOption = {
    [K in keyof Calendar.Options]-?: NonNullable<Calendar.Options[K]> extends (...args: any[]) => infer R
        ? [R] extends [void] ? K : never
        : never;
}[keyof Calendar.Options];

export type EventCalendarProps =
    & Calendar.Options
    /** The callbacks of the calendar can be given as event listeners: `@event-click="..."` */
    & { [K in CallbackOption as `on${Capitalize<K>}`]?: Calendar.Options[K] }
    & {
        plugins: Calendar.Plugin[];
        /** The options as an object, the options passed as separate props take precedence */
        options?: Calendar.Options;
    };

/** The slots render the content of the options with the same names, inside the same elements */
export interface EventCalendarSlots {
    allDayContent?(arg: Calendar.AllDayContentArg): any;
    dayCellContent?(arg: Calendar.DayCellContentArg): any;
    eventContent?(info: Calendar.EventContentInfo): any;
    moreLinkContent?(info: Calendar.MoreLinkInfo): any;
    noEventsContent?(): any;
    resourceLabelContent?(info: Calendar.ResourceLabelInfo): any;
    weekNumberContent?(arg: Calendar.WeekNumberContentArg): any;
    /** A toolbar item, named after the item in the `headerToolbar` option with the first letter capitalized */
    [key: `customButton${Capitalize<string>}`]: (() => any) | undefined;
}

/** The calendar. Its methods are available through the template ref. */
export const EventCalendar: {
    new (): Calendar & {
        $props: EventCalendarProps & AllowedComponentProps & ComponentCustomProps & VNodeProps;
        $slots: EventCalendarSlots;
    };
};
