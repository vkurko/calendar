<script>
    import {Calendar, DayGrid, TimeGrid, List, ResourceTimeGrid, ResourceTimeline, Interaction} from '@event-calendar/core';

    const DAY = 86400000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today.getTime() - today.getDay() * DAY);

    function at(dayOffset, hour, minutes = 0) {
        const date = new Date(weekStart.getTime() + dayOffset * DAY);
        date.setHours(hour, minutes);
        return date;
    }

    // A phone has no room for a week and for all the buttons
    const narrow = window.innerWidth < 700;

    let options = $state({
        view: narrow ? 'timeGridDay' : 'timeGridWeek',
        height: '640px',
        headerToolbar: narrow
            ? {start: 'title', center: '', end: 'prev,next timeGridDay,listWeek,dayGridMonth'}
            : {
                start: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek resourceTimeGridWeek,resourceTimelineWeek'
            },
        buttonText: text => ({
            ...text,
            today: 'Today',
            dayGridMonth: 'Month',
            timeGridWeek: 'Week',
            timeGridDay: 'Day',
            listWeek: 'List',
            resourceTimeGridWeek: 'Resources',
            resourceTimelineWeek: 'Timeline'
        }),
        // The week with resources has many columns: they keep a readable width and the calendar is scrolled
        views: {resourceTimeGridWeek: {columnWidth: '110px'}},
        resources: [
            {id: 1, title: 'Room A'},
            {id: 2, title: 'Room B'},
            {id: 3, title: 'Room C'}
        ],
        nowIndicator: true,
        editable: true,
        selectable: true,
        dayMaxEvents: true,
        slotMinTime: '06:00',
        slotMaxTime: '22:00',
        scrollTime: '08:00',
        events: [
            {id: 1, start: at(1, 9), end: at(1, 11), title: 'Team stand-up', color: '#0ea5e9', resourceId: 1},
            {id: 2, start: at(1, 13), end: at(1, 15, 30), title: 'Design review', color: '#8b5cf6', resourceId: 2},
            {id: 3, start: at(2, 10), end: at(2, 12), title: 'Sprint planning', color: '#f59e0b', resourceId: 1},
            {id: 4, start: at(3, 9, 30), end: at(3, 10, 30), title: 'Dentist', color: '#ef4444', resourceId: 3},
            {id: 5, start: at(3, 14), end: at(3, 17), title: 'Deep work', color: '#10b981', resourceId: 2},
            {id: 6, start: at(4, 11), end: at(4, 12), title: '1:1 with Ann', color: '#0ea5e9', resourceId: 1},
            {id: 7, start: at(4, 16), end: at(4, 18), title: 'Code review', color: '#8b5cf6', resourceId: 3},
            {id: 8, start: at(5, 12), end: at(5, 13), title: 'Lunch with Bob', color: '#f59e0b', resourceId: 2},
            {id: 9, start: at(5, 15), end: at(5, 16, 30), title: 'Retrospective', color: '#10b981', resourceId: 1},
            {id: 10, start: at(2, 0), end: at(5, 0), title: 'Conference week', color: '#6366f1', allDay: true, resourceId: 2},
            {id: 11, start: at(6, 10), end: at(6, 13), title: 'Brunch & board games', color: '#ec4899', resourceId: 3},
            // соседние недели — чтобы месяц не пустовал
            {id: 12, start: at(-5, 10), end: at(-5, 12), title: 'Quarterly review', color: '#8b5cf6', resourceId: 1},
            {id: 13, start: at(-3, 15), end: at(-3, 17), title: 'Workshop', color: '#10b981', resourceId: 2},
            {id: 14, start: at(8, 9), end: at(8, 10), title: 'Kick-off', color: '#0ea5e9', resourceId: 1},
            {id: 15, start: at(10, 0), end: at(12, 0), title: 'Offsite', color: '#f59e0b', allDay: true, resourceId: 3},
            {id: 16, start: at(11, 14), end: at(11, 16), title: 'Interview', color: '#ef4444', resourceId: 2}
        ]
    });

    // Follow the Starlight theme toggle (data-theme on <html>)
    let dark = $state(false);
    $effect(() => {
        const root = document.documentElement;
        const update = () => dark = root.dataset.theme === 'dark';
        update();
        const observer = new MutationObserver(update);
        observer.observe(root, {attributes: true, attributeFilter: ['data-theme']});
        return () => observer.disconnect();
    });
</script>

<div class="hero-calendar not-content" class:ec-dark={dark}>
    <Calendar plugins={[DayGrid, TimeGrid, List, ResourceTimeGrid, ResourceTimeline, Interaction]} {options} />
</div>

<style>
    .hero-calendar {
        margin-top: 1rem;
        text-align: initial;
    }
</style>
