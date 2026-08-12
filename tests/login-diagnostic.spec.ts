import { test } from '@playwright/test';

test('inspect Automation Anywhere login page', async ({ page }) => {

    page.on('console', msg => {
        console.log(
            `[BROWSER ${msg.type()}] ${msg.text()}`
        );
    });

    page.on('pageerror', error => {
        console.log(
            '[PAGE ERROR]',
            error.message
        );
    });

    page.on('requestfailed', request => {
        console.log(
            '[REQUEST FAILED]',
            request.url(),
            request.failure()?.errorText
        );
    });

    page.on('response', response => {
        if (response.status() >= 400) {
            console.log(
                '[HTTP ERROR]',
                response.status(),
                response.url()
            );
        }
    });

    const url =
        'https://community.cloud.automationanywhere.digital/#/login?next=/home';

    const response = await page.goto(url, {
        waitUntil: 'commit',
        timeout: 30000
    });

    await page.waitForTimeout(10000);

    console.log('\n========== PAGE INFO ==========');

    console.log(
        'Response:',
        response?.status()
    );

    console.log(
        'URL:',
        page.url()
    );

    console.log(
        'Title:',
        await page.title()
    );

    console.log(
        'BODY HTML:'
    );

    console.log(
        await page.locator('body').innerHTML()
    );

    console.log(
        '\n========== SCRIPTS =========='
    );

    const scripts = await page.locator('script').evaluateAll(
        elements =>
            elements.map(script => ({
                src: (script as HTMLScriptElement).src,
                type: (script as HTMLScriptElement).type,
                textLength: script.textContent?.length || 0
            }))
    );

    console.log(
        JSON.stringify(scripts, null, 2)
    );

    console.log(
        '\n========== RESOURCE COUNT =========='
    );

    const resources = await page.evaluate(() =>
        performance.getEntriesByType('resource')
            .map((entry: any) => ({
                name: entry.name,
                initiatorType: entry.initiatorType
            }))
    );

    console.log(
        'Total resources:',
        resources.length
    );

    console.log(
        JSON.stringify(resources.slice(0, 50), null, 2)
    );

    await page.screenshot({
        path: 'automation-anywhere-debug.png',
        fullPage: true
    });
});