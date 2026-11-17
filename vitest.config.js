import {defineConfig} from 'vitest/config';

// The tests in tests/unit/zones compare with the native time zone and run in each of these zones, west and east
// of UTC, in both hemispheres, with half-hour offsets, with changes at midnight and with a skipped day
const zones = [
    'America/Los_Angeles',
    'America/St_Johns',
    'America/Santiago',
    'America/Sao_Paulo',
    'Europe/London',
    'Africa/Casablanca',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Australia/Lord_Howe',
    'Pacific/Auckland',
    'Pacific/Apia'
];

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['tests/unit/**/*.test.js'],
                    // Tests rely on daylight saving time transitions, so the time zone is fixed
                    env: {TZ: 'Europe/Amsterdam'}
                }
            },
            ...zones.map(zone => ({
                test: {
                    name: zone,
                    include: ['tests/unit/zones/*.test.js'],
                    env: {TZ: zone}
                }
            }))
        ]
    }
});
