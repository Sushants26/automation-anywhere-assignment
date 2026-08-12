import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

async function setupAuthentication() {

    const browser = await chromium.launch({
        headless: false
    });

    const context = await browser.newContext();

    const page = await context.newPage();

    console.log('Opening Automation Anywhere login...');

    await page.goto(
        'https://community.cloud.automationanywhere.digital/#/login?next=/home',
        {
            waitUntil: 'commit',
            timeout: 60000
        }
    );

    console.log('Waiting for login page...');

    await page.waitForTimeout(10000);

    const username = page.locator(
        'input[name="username"]'
    );

    const password = page.locator(
        'input[name="password"]'
    );

    const loginButton = page.locator(
        'button[name="submitLogin"]'
    );

    await username.waitFor({
        state: 'visible',
        timeout: 60000
    });

    console.log('Login form found');

    await username.fill(
        process.env.AA_USERNAME!
    );

    await password.fill(
        process.env.AA_PASSWORD!
    );

    await loginButton.click();

    console.log('Login clicked');

    await page.getByRole(
        'link',
        {
            name: 'Automation',
            exact: true
        }
    ).waitFor({
        state: 'visible',
        timeout: 60000
    });

    console.log('Authentication successful');

    await context.storageState({
        path: 'auth/auth-state.json'
    });

    console.log(
        'Authentication state saved to auth/auth-state.json'
    );

    await browser.close();
}

setupAuthentication();