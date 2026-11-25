// Sample data of the live examples, placed around the current week so that the calendars are never empty

const DAY = 86400000;

export function startOfToday() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

// The date at the given time of the day, like '12:30'
export function time(date, hhmm) {
    let [hours, minutes] = hhmm.split(':');
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

// The seven days of the current week, from Sunday
export function currentWeek() {
    let today = startOfToday();
    return [0, 1, 2, 3, 4, 5, 6].map(weekday => addDays(today, weekday - today.getDay()));
}

export function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function sampleResources() {
    return [
        {id: 1, title: 'Room A'},
        {id: 2, title: 'Room B'},
        {id: 3, title: 'Room C'}
    ];
}

// An illustrated portrait, in place of a photo
function portrait(background, hair, skin = '#f1c9a5') {
    return 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/>`
        + `<path d="M10 64c0-13 10-21 22-21s22 8 22 21z" fill="#fff" opacity=".92"/>`
        + `<circle cx="32" cy="27" r="12" fill="${skin}"/>`
        + `<path d="M19 27c-1-10 5-16 13-16s14 6 13 16c-3-6-7-8-13-8s-10 2-13 8z" fill="${hair}"/></svg>`
    );
}

// Events on the days of the current month that are outside of the current week
function monthEvents(today, weekStart) {
    const PLAN = [
        [2, 'Budget review', '#8b5cf6', 10, 2], [3, 'Onboarding', '#0ea5e9', 9, 1], [5, 'Team lunch', '#f59e0b', 12, 1],
        [8, 'Roadmap', '#10b981', 11, 2], [9, 'Release', '#ef4444', 15, 1], [11, 'Webinar', '#6366f1', 14, 2],
        [12, 'Hackathon', '#ec4899', 0, 48], [15, 'Board meeting', '#8b5cf6', 10, 2], [16, 'Customer call', '#0ea5e9', 13, 1],
        [18, 'Training', '#10b981', 0, 72], [19, 'Design sync', '#f59e0b', 11, 1], [22, 'Planning', '#6366f1', 9, 2],
        [23, 'Interview', '#ef4444', 14, 1], [25, 'Retro', '#10b981', 16, 1], [26, 'Demo day', '#ec4899', 13, 2],
        [29, 'Month wrap-up', '#0ea5e9', 10, 2]
    ];
    let weekEnd = addDays(weekStart, 7);
    let events = [];
    for (let [day, title, color, hour, hours] of PLAN) {
        let start = new Date(today.getFullYear(), today.getMonth(), day, hour);
        // Not in another month, and not in the current week, which has its own events
        if (start.getMonth() === today.getMonth() && (start < weekStart || start >= weekEnd)) {
            let allDay = hours >= 24;
            let end = new Date(today.getFullYear(), today.getMonth(), day + (allDay ? hours / 24 : 0), hour + (allDay ? 0 : hours));
            events.push({id: 100 + day, resourceId: 1 + day % 3, start, end, title, color, allDay});
        }
    }
    return events;
}

// The same resources as people, for the examples with their own labels
export function samplePeople() {
    return [
        {id: 1, title: 'Anna Lee', extendedProps: {role: 'Product designer', photo: portrait('#c7d2fe', '#4a3728')}},
        {id: 2, title: 'Ben Carter', extendedProps: {role: 'Frontend engineer', photo: portrait('#bae6fd', '#1f2937', '#e0ac69')}},
        {id: 3, title: 'Chloe Kim', extendedProps: {role: 'Project manager', photo: portrait('#fbcfe8', '#111827', '#f5d0b0')}}
    ];
}

const ATTENDEES = [['Anna', 'Ben'], ['Chloe'], ['Anna', 'Ben', 'Chloe'], ['Ben']];

export function sampleEvents() {
    let today = startOfToday();
    let weekStart = new Date(today.getTime() - today.getDay() * DAY);
    let at = (dayOffset, hour, minutes = 0) => {
        let date = addDays(weekStart, dayOffset);
        date.setHours(hour, minutes);
        return date;
    };
    // The working day starts at 8, where the calendars of the examples are scrolled to
    return [
        {id: 1, resourceId: 1, start: at(1, 8), end: at(1, 10), title: 'Team stand-up', color: '#0ea5e9'},
        {id: 2, resourceId: 2, start: at(1, 11), end: at(1, 13, 30), title: 'Design review', color: '#8b5cf6'},
        {id: 3, resourceId: 1, start: at(2, 9), end: at(2, 11), title: 'Sprint planning', color: '#f59e0b'},
        {id: 4, resourceId: 3, start: at(3, 8, 30), end: at(3, 9, 30), title: 'Dentist', color: '#ef4444'},
        {id: 5, resourceId: 2, start: at(3, 12, 30), end: at(3, 15), title: 'Deep work', color: '#10b981'},
        {id: 6, resourceId: 1, start: at(4, 9), end: at(4, 10), title: '1:1 with Ann', color: '#0ea5e9'},
        {id: 7, resourceId: 3, start: at(4, 12), end: at(4, 14), title: 'Code review', color: '#8b5cf6'},
        {id: 8, resourceId: 2, start: at(5, 10), end: at(5, 11), title: 'Lunch with Bob', color: '#f59e0b'},
        {id: 9, resourceId: 1, start: at(5, 12), end: at(5, 13, 30), title: 'Retrospective', color: '#10b981'},
        {id: 10, resourceId: 2, start: at(2, 0), end: at(5, 0), title: 'Conference', color: '#6366f1', allDay: true},
        {id: 11, resourceId: 3, start: at(6, 9), end: at(6, 12), title: 'Brunch', color: '#ec4899'},
        {id: 12, resourceId: 1, start: at(-5, 10), end: at(-5, 12), title: 'Quarterly review', color: '#8b5cf6'},
        {id: 13, resourceId: 2, start: at(-3, 13), end: at(-3, 15), title: 'Workshop', color: '#10b981'},
        {id: 14, resourceId: 1, start: at(8, 9), end: at(8, 10), title: 'Kick-off', color: '#0ea5e9'},
        {id: 15, resourceId: 3, start: at(10, 0), end: at(12, 0), title: 'Offsite', color: '#f59e0b', allDay: true},
        {id: 16, resourceId: 2, start: at(11, 13), end: at(11, 15), title: 'Interview', color: '#ef4444'},
        // The same day as other events, so that the month view has a day with more events than fit
        {id: 17, resourceId: 3, start: at(3, 10), end: at(3, 11), title: 'Demo for the client', color: '#0ea5e9'},
        {id: 18, resourceId: 1, start: at(3, 11, 30), end: at(3, 12, 30), title: 'Lunch & learn', color: '#f59e0b'},
        {id: 19, resourceId: 1, start: at(3, 15, 30), end: at(3, 16, 30), title: 'Yoga', color: '#ec4899'},
        // The rest of the month, so that the month views are filled wherever the current week is
        ...monthEvents(today, weekStart)
    ].map((event, i) => ({
        ...event,
        // Who takes part and whether it is confirmed, for the examples with their own event content
        extendedProps: {attendees: ATTENDEES[i % ATTENDEES.length], status: i % 3 ? 'confirmed' : 'tentative'}
    }));
}

/**
 * A day of a team for the examples that render the events and the resources in their own way: the events have
 * no colors, but a type, a room and the people who take part, each with a photo.
 */
export function sampleMeetings() {
    let today = startOfToday();
    let people = samplePeople();
    let person = id => {
        let {title, extendedProps: {photo}} = people.find(resource => resource.id === id);
        return {name: title, photo};
    };
    let at = (hour, minutes = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes);
    // The owner of a meeting is the resource it is shown at
    let meeting = (id, owner, start, end, title, type, room, others = []) => ({
        id, resourceId: owner, start, end, title,
        extendedProps: {type, room, attendees: [owner, ...others].map(person)}
    });
    return [
        meeting(1, 1, at(8), at(9), 'Daily stand-up', 'meeting', 'Online', [2, 3]),
        meeting(2, 1, at(9, 30), at(11, 30), 'Design system', 'focus', 'Studio'),
        meeting(3, 1, at(13), at(14), 'Portfolio review', 'review', 'Room A', [3]),
        meeting(4, 1, at(14, 30), at(15, 30), 'Yoga', 'personal', 'Gym'),
        meeting(5, 2, at(8), at(9), 'Daily stand-up', 'meeting', 'Online', [1, 3]),
        meeting(6, 2, at(9), at(10), 'Code review', 'review', 'Room B', [1]),
        meeting(7, 2, at(10, 30), at(13), 'Calendar component', 'focus', 'Desk'),
        meeting(8, 2, at(14), at(15, 30), 'Pair programming', 'meeting', 'Room B', [3]),
        meeting(9, 3, at(8), at(9), 'Daily stand-up', 'meeting', 'Online', [1, 2]),
        meeting(10, 3, at(9, 30), at(10, 30), 'Roadmap', 'focus', 'Room C'),
        meeting(11, 3, at(11), at(12, 30), 'Client demo', 'meeting', 'Room A', [1, 2]),
        meeting(12, 3, at(13, 30), at(15), 'Hiring interview', 'review', 'Room C', [2])
    ];
}
