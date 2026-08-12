import { Page, expect } from '@playwright/test';

export class LoginPage {

    constructor(private page: Page) {}

    async open() {

        await this.page.goto(
            'https://community.cloud.automationanywhere.digital/#/login?next=/home',
            {
                waitUntil: 'commit',
                timeout: 60000
            }
        );

        await this.page.waitForTimeout(10000);

        await expect(
            this.page.locator('input[name="username"]')
        ).toBeVisible({
            timeout: 30000
        });
    }

    async login(
        username: string,
        password: string
    ) {

        const usernameInput =
            this.page.locator('input[name="username"]');

        const passwordInput =
            this.page.locator('input[name="password"]');

        const loginButton =
            this.page.locator('button[name="submitLogin"]');

        await usernameInput.fill(username);

        await expect(
            usernameInput
        ).toHaveValue(username);

        await passwordInput.fill(password);

        await loginButton.click();
    }

    async verifyLoginSuccessful() {

        await expect(
            this.page.getByRole(
                'link',
                {
                    name: 'Automation',
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 30000
        });
    }
}