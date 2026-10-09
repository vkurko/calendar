import {defineConfig} from 'vitest/config';

// Tests rely on daylight saving time transitions, so the time zone is fixed
process.env.TZ = 'Europe/Amsterdam';

export default defineConfig({
    test: {
        include: ['tests/unit/**/*.test.js']
    }
});
