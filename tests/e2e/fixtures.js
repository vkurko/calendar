import {test as base, expect} from '@playwright/test';

// Today in all tests, unless a test sets its own time
export const NOW = new Date('2026-10-08T12:00:00+02:00');

export const test = base.extend({
    // Fails the test on any uncaught error in the page
    page: async ({page}, use) => {
        let errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.clock.setFixedTime(NOW);
        await use(page);
        expect(errors).toEqual([]);
    }
});

export {expect};

export async function openPage(page) {
    await page.goto('/tests/e2e/page.html');
    await page.waitForFunction(() => window.ready);
}

/**
 * Drag with the mouse from one point to another in several steps
 */
export async function drag(page, from, to) {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, {steps: 10});
    await page.mouse.up();
}

export function center(box) {
    return {x: box.x + box.width / 2, y: box.y + box.height / 2};
}
