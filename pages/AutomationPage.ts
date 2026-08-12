import { Page, expect } from '@playwright/test';

export class AutomationPage {

    constructor(private page: Page) {}

    async openAutomation() {

        const automationLink =
            this.page.getByRole(
                'link',
                {
                    name: 'Automation',
                    exact: true
                }
            );

        await expect(
            automationLink
        ).toBeVisible({
            timeout: 30000
        });

        console.log('Automation menu found');

        await automationLink.click();

        console.log('Automation menu clicked');

        await this.page.waitForTimeout(3000);

        console.log(
            'Current URL:',
            this.page.url()
        );

        console.log(
            'Page title:',
            await this.page.title()
        );
    }

    async verifyAutomationPage() {

        await expect(
            this.page.getByRole(
                'heading',
                {
                    name: /Automation/
                }
            )
        ).toBeVisible({
            timeout: 30000
        });
    }
}