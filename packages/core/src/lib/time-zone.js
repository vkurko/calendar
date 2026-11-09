// One formatter per zone, null marks an unknown name
const formatters = new Map();

function getFormatter(zone) {
    let formatter = formatters.get(zone);
    if (formatter === undefined) {
        try {
            formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: zone,
                hourCycle: 'h23',
                era: 'short',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
        } catch {
            formatter = null;
        }
        formatters.set(zone, formatter);
    }

    return formatter;
}

/**
 * Check whether the name is an IANA time zone name known to the browser
 */
export function isTimeZoneName(name) {
    return !!getFormatter(name);
}

/**
 * Get the offset from UTC in minutes of a time zone at an instant (milliseconds since the epoch).
 * Like a native Date, it is NaN for an invalid date or one out of range
 */
export function zoneOffset(zone, time) {
    if (!(Math.abs(time) <= 8.64e15)) {
        return NaN;
    }
    let {era, ...parts} = Object.fromEntries(
        getFormatter(zone).formatToParts(time).map(({type, value}) => [type, type === 'era' ? value : +value])
    );
    // Years before 1 are positive in the output and have the era BC. Date.UTC() would read 0 to 99 as 19xx
    let wall = new Date(0).setUTCFullYear(era === 'BC' ? 1 - parts.year : parts.year, parts.month - 1, parts.day);
    wall += ((parts.hour * 60 + parts.minute) * 60 + parts.second) * 1000;

    return Math.round((wall - time) / 60000);
}

/**
 * Get the offset in minutes of a time zone that reads a wall time (milliseconds, as if UTC) like a native Date:
 * the repeated hour as its first occurrence, the skipped hour moved forward with the offset before the change
 */
export function zoneWallOffset(zone, wall) {
    // The offsets a day before and a day after differ only if a change is near the wall time
    let before = zoneOffset(zone, wall - 86400000);
    let after = zoneOffset(zone, wall + 86400000);
    if (before === after) {
        return before;
    }
    // An offset fits if it is in force at the instant it gives, then the larger one is the earlier instant
    let fitting = [before, after].filter(offset => zoneOffset(zone, wall - offset * 60000) === offset);

    return fitting.length ? Math.max(...fitting) : before;
}
