import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['html', {open: 'never'}]] : 'list',
    use: {
        baseURL: 'http://localhost:5199',
        // Tests rely on daylight saving time transitions, so the time zone is fixed
        timezoneId: 'Europe/Amsterdam',
        locale: 'en-US',
        viewport: {width: 1200, height: 800},
        trace: 'retain-on-failure'
    },
    projects: [
        {name: 'chromium', use: {...devices['Desktop Chrome'], viewport: {width: 1200, height: 800}}}
    ],
    webServer: {
        command: 'npx vite --port 5199 --strictPort',
        url: 'http://localhost:5199/tests/e2e/page.html',
        reuseExistingServer: !process.env.CI
    }
});
