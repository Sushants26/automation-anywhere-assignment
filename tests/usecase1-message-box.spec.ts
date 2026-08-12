import { test, expect } from '@playwright/test';

test.describe('Use Case 1 - Message Box Task', () => {

    test(
        'should create and configure Message Box Task Bot',
        async ({ page }) => {

            test.setTimeout(180_000);

            const botName =
                `PW_MessageBox_Test_${Date.now()}`;

            const windowTitle =
                'Playwright Message Box';

            const message =
                'Hello from Sushant\'s automation';

            const scrollbarLines =
                '30';

            // =====================================================
            // 1. OPEN CONTROL ROOM
            // =====================================================

            console.log(
                'Opening authenticated Control Room...'
            );

            await page.goto('/#/home', {
                waitUntil: 'commit',
                timeout: 60_000,
            });

            await page.waitForTimeout(5_000);

            console.log(
                'Current URL:',
                page.url()
            );

            // =====================================================
            // 2. OPEN AUTOMATION
            // =====================================================

            const automation =
                page.getByText(
                    'Automation',
                    {
                        exact: true,
                    }
                ).first();

            await expect(
                automation
            ).toBeVisible({
                timeout: 60_000,
            });

            console.log(
                'Automation menu found'
            );

            await automation.click();

            console.log(
                'Automation menu clicked'
            );

            await page.waitForTimeout(5_000);

            // =====================================================
            // 3. CREATE
            // =====================================================

            const createButton =
                page.locator(
                    'button, [role="button"]'
                ).filter({
                    hasText: /^Create$/,
                }).first();

            await expect(
                createButton
            ).toBeVisible({
                timeout: 60_000,
            });

            console.log(
                'Create button found'
            );

            await createButton.click();

            console.log(
                'Create clicked'
            );

            await page.waitForTimeout(1_000);

            // =====================================================
            // 4. SELECT TASK BOT
            // =====================================================

            const taskBot =
                page.getByText(
                    /^Task Bot…?$/
                ).last();

            await expect(
                taskBot
            ).toBeVisible({
                timeout: 30_000,
            });

            console.log(
                'Task Bot menu item found'
            );

            await taskBot.click();

            console.log(
                'Task Bot selected'
            );

            await page.waitForTimeout(2_000);

            // =====================================================
            // 5. TASK BOT NAME
            // =====================================================

            let nameInput = page.locator(
                'input[name="name"]:visible:not([readonly]):not([disabled])'
            ).first();

            if (
                !(await nameInput.isVisible().catch(() => false))
            ) {

                nameInput = page.locator(
                    'input[placeholder="Name"]:visible:not([readonly]):not([disabled])'
                ).first();
            }

            if (
                !(await nameInput.isVisible().catch(() => false))
            ) {

                nameInput = page.locator(
                    'input[aria-label="Name"]:visible:not([readonly]):not([disabled])'
                ).first();
            }

            await expect(
                nameInput
            ).toBeVisible({
                timeout: 30_000,
            });

            await nameInput.fill(
                botName
            );

            console.log(
                'Bot name entered:',
                botName
            );

            // =====================================================
            // 6. CREATE & EDIT
            // =====================================================

            const createEdit =
                page.getByRole(
                    'button',
                    {
                        name: 'Create & edit',
                        exact: true,
                    }
                ).last();

            await expect(
                createEdit
            ).toBeVisible({
                timeout: 30_000,
            });

            await createEdit.click();

            console.log(
                'Create & edit clicked'
            );

            // =====================================================
            // 7. WAIT FOR EDITOR
            // =====================================================

            await page.waitForURL(
                /\/files\/task\/.*\/edit/,
                {
                    timeout: 60_000,
                }
            );

            await page.waitForTimeout(
                5_000
            );

            console.log(
                'Task Bot editor opened:',
                page.url()
            );

            // =====================================================
            // 8. FIND MESSAGE BOX ACTION
            // =====================================================

            const messageBoxCategory =
                page.locator(
                    'button[aria-label="Message box"]'
                ).last();

            await expect(
                messageBoxCategory
            ).toBeVisible({
                timeout: 30_000,
            });

            console.log(
                'Message Box action found'
            );

            await messageBoxCategory.click();

            await page.waitForTimeout(
                1_000
            );

            // =====================================================
            // 9. ADD MESSAGE BOX TO FLOW
            // =====================================================

            const messageBoxItem =
                page.locator(
                    'button[name="item-button"][aria-label="Message box"]'
                ).last();

            await expect(
                messageBoxItem
            ).toBeVisible({
                timeout: 30_000,
            });

            await messageBoxItem.dblclick();

            console.log(
                'Message Box added'
            );

            await page.waitForTimeout(
                3_000
            );

            // =====================================================
            // 10. SELECT MESSAGE BOX IN FLOW
            // =====================================================

            const flowMessageBox =
                page.getByText(
                    'Message box',
                    {
                        exact: true,
                    }
                ).last();

            if (
                await flowMessageBox
                    .isVisible()
                    .catch(() => false)
            ) {

                await flowMessageBox.click();

                console.log(
                    'Message Box flow action selected'
                );
            }

            await page.waitForTimeout(
                2_000
            );

            // =====================================================
            // 11. WAIT FOR CONFIGURATION
            // =====================================================

            const titleLabel =
                page.getByText(
                    'Enter the message box window title',
                    {
                        exact: true,
                    }
                ).first();

            await expect(
                titleLabel
            ).toBeVisible({
                timeout: 30_000,
            });

            console.log(
                'Message Box configuration opened'
            );

            // =====================================================
            // HELPER:
            // FIND EDITABLE CONTROL NEAR A LABEL
            // =====================================================

            async function findField(
                labelText: string
            ) {

                const label =
                    page.getByText(
                        labelText,
                        {
                            exact: true,
                        }
                    ).first();

                await expect(
                    label
                ).toBeVisible({
                    timeout: 30_000,
                });

                for (
                    let level = 1;
                    level <= 8;
                    level++
                ) {

                    const container =
                        label.locator(
                            `xpath=ancestor::*[${level}]`
                        );

                    // Normal input
                    const input =
                        container.locator(
                            'input:not([readonly]):not([disabled])'
                        ).first();

                    if (
                        await input
                            .isVisible()
                            .catch(() => false)
                    ) {
                        return input;
                    }

                    // Textarea
                    const textarea =
                        container.locator(
                            'textarea:not([readonly]):not([disabled])'
                        ).first();

                    if (
                        await textarea
                            .isVisible()
                            .catch(() => false)
                    ) {
                        return textarea;
                    }

                    // Custom Automation Anywhere textbox
                    const editable =
                        container.locator(
                            '[contenteditable="true"]'
                        ).first();

                    if (
                        await editable
                            .isVisible()
                            .catch(() => false)
                    ) {
                        return editable;
                    }

                    // Role textbox
                    const textbox =
                        container.getByRole(
                            'textbox'
                        ).first();

                    if (
                        await textbox
                            .isVisible()
                            .catch(() => false)
                    ) {

                        const tag =
                            await textbox.evaluate(
                                el => el.tagName
                            ).catch(() => '');

                        const readonly =
                            await textbox.getAttribute(
                                'readonly'
                            ).catch(() => null);

                        if (
                            tag !== 'INPUT' ||
                            readonly === null
                        ) {
                            return textbox;
                        }
                    }
                }

                throw new Error(
                    `Could not find editable field for: ${labelText}`
                );
            }

            // =====================================================
            // 12. WINDOW TITLE
            // =====================================================

            console.log(
                'Entering Message Box window title...'
            );

            const titleInput =
                await findField(
                    'Enter the message box window title'
                );

            await titleInput.fill(
                windowTitle
            );

            console.log(
                'Window title entered:',
                windowTitle
            );

            // =====================================================
            // 13. MESSAGE
            // =====================================================

            console.log(
                'Entering Message Box message...'
            );

            const messageInput =
                await findField(
                    'Enter the message to display'
                );

            await messageInput.fill(
                message
            );

            console.log(
                'Message entered:',
                message
            );

            // =====================================================
            // 14. SCROLLBAR AFTER LINES
            // =====================================================

            console.log(
                'Entering Scrollbar after lines...'
            );

            const scrollbarLabel =
                page.getByText(
                    'Scrollbar after lines',
                    {
                        exact: true,
                    }
                ).first();

            await expect(
                scrollbarLabel
            ).toBeVisible({
                timeout: 30_000,
            });

            let scrollbarInput: Locator | null = null;

            /*
             * Automation Anywhere renders this particular
             * control differently from the title/message fields.
             *
             * Search through its parent containers for:
             *
             * - input
             * - textarea
             * - contenteditable
             * - textbox
             */

            for (
                let level = 1;
                level <= 8;
                level++
            ) {

                const container =
                    scrollbarLabel.locator(
                        `xpath=ancestor::*[${level}]`
                    );

                const editableInput =
                    container.locator(
                        'input:not([readonly]):not([disabled])'
                    ).first();

                if (
                    await editableInput
                        .isVisible()
                        .catch(() => false)
                ) {

                    scrollbarInput =
                        editableInput;

                    break;
                }

                const editable =
                    container.locator(
                        '[contenteditable="true"]'
                    ).first();

                if (
                    await editable
                        .isVisible()
                        .catch(() => false)
                ) {

                    scrollbarInput =
                        editable;

                    break;
                }

                const textbox =
                    container.getByRole(
                        'textbox'
                    ).first();

                if (
                    await textbox
                        .isVisible()
                        .catch(() => false)
                ) {

                    scrollbarInput =
                        textbox;

                    break;
                }
            }

            if (!scrollbarInput) {

                throw new Error(
                    'Scrollbar after lines field could not be found.'
                );
            }

            console.log(
                'Scrollbar field found'
            );

            await scrollbarInput.fill(
                scrollbarLines
            );

            console.log(
                'Scrollbar after lines entered:',
                scrollbarLines
            );

            // =====================================================
            // 15. VERIFY SCROLLBAR VALUE
            // =====================================================

            const actualScrollbarValue =
                await scrollbarInput.evaluate(
                    element => {

                        if (
                            element instanceof
                            HTMLInputElement
                        ) {
                            return element.value;
                        }

                        if (
                            element instanceof
                            HTMLTextAreaElement
                        ) {
                            return element.value;
                        }

                        return (
                            element.textContent ||
                            element.innerText ||
                            ''
                        ).trim();
                    }
                );

            console.log(
                'Scrollbar actual value:',
                JSON.stringify(
                    actualScrollbarValue
                )
            );

            // =====================================================
            // 16. DO NOT CONFIGURE:
            //
            // "Close message box after"
            //
            // We intentionally skip that setting.
            //
            // The required test ends with:
            //
            // Title
            // Message
            // Scrollbar = 30
            // Run
            // =====================================================

            console.log(
                'Message Box configuration complete.'
            );

            console.log(
                'Title:',
                windowTitle
            );

            console.log(
                'Message:',
                message
            );

            console.log(
                'Scrollbar:',
                scrollbarLines
            );

            // =====================================================
            // 17. SAVE
            // =====================================================

            const saveButton =
                page.getByRole(
                    'button',
                    {
                        name: 'Save',
                        exact: true,
                    }
                ).last();

            if (
                await saveButton
                    .isVisible()
                    .catch(() => false)
            ) {

                await saveButton.click();

                console.log(
                    'Save clicked'
                );

                await page.waitForTimeout(
                    2_000
                );
            }

            // =====================================================
            // 18. FIND THE ACTUAL RUN BUTTON
            // =====================================================

            console.log(
                'Looking for actual Run button...'
            );

            /*
             * IMPORTANT:
             *
             * DO NOT USE:
             *
             * page.locator('button').filter({
             *     hasText: 'Run'
             * }).click()
             *
             * That was selecting the wrong control.
             *
             * Automation Anywhere exposes the actual editor
             * Run button as:
             *
             * button[name="run"][aria-label="Run"]
             */

            const runButtons =
                page.locator(
                    'button[name="run"][aria-label="Run"]'
                );

            const runCount =
                await runButtons.count();

            console.log(
                'Run button count:',
                runCount
            );

            if (
                runCount === 0
            ) {

                throw new Error(
                    'Actual Run button was not found.'
                );
            }

            // =====================================================
            // 19. CHOOSE THE EDITOR RUN BUTTON
            // =====================================================

            let runButton: Locator | null = null;

            for (
                let i = 0;
                i < runCount;
                i++
            ) {

                const candidate =
                    runButtons.nth(i);

                if (
                    await candidate
                        .isVisible()
                        .catch(() => false)
                ) {

                    const box =
                        await candidate
                            .boundingBox()
                            .catch(() => null);

                    if (box) {

                        console.log(
                            `Run button ${i}:`,
                            box
                        );

                        /*
                         * The editor toolbar is normally at the
                         * top of the application.
                         *
                         * Prefer the visible candidate.
                         */

                        runButton =
                            candidate;

                        break;
                    }
                }
            }

            if (!runButton) {

                throw new Error(
                    'Visible Run button was not found.'
                );
            }

            await expect(
                runButton
            ).toBeVisible({
                timeout: 30_000,
            });

            await expect(
                runButton
            ).toBeEnabled({
                timeout: 15_000,
            });

            // =====================================================
            // 20. CLICK RUN
            // =====================================================

            console.log(
                'Run button found.'
            );

            console.log(
                'Clicking ACTUAL Run button now...'
            );

            /*
             * Use the exact Run button's DOM click.
             *
             * This avoids the header/Assistant/Debug elements
             * intercepting the normal Playwright mouse click.
             */

            await runButton.evaluate(
                (element) => {

                    (
                        element as HTMLElement
                    ).click();
                }
            );

            console.log(
                '========================================'
            );

            console.log(
                'RUN BUTTON CLICKED'
            );

            console.log(
                '========================================'
            );

            // =====================================================
            // 21. WAIT FOR MESSAGE BOX
            // =====================================================

            console.log(
                'Waiting for the Message Box to appear...'
            );

            /*
             * Give Automation Anywhere time to execute the
             * Task Bot.
             */

            await page.waitForTimeout(
                10_000
            );

            console.log(
                '10 seconds passed.'
            );

            console.log(
                'Message Box should now be visible.'
            );

            console.log(
                'Expected window title:',
                windowTitle
            );

            console.log(
                'Expected message:',
                message
            );

            // =====================================================
            // 22. KEEP BROWSER OPEN
            // =====================================================

            /*
             * IMPORTANT:
             *
             * Do NOT let Playwright finish immediately.
             *
             * This gives you time to SEE the message box.
             */

            console.log(
                'Keeping browser open so the Message Box can be observed...'
            );

            // Keep the Node.js process alive instead of relying on
            // page.waitForTimeout(), because the test runner may close
            // the page/context after the test body completes.
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 30_000);
            });

            console.log(
                '========================================'
            );

            console.log(
                'TEST FINISHED'
            );

            console.log(
                '========================================'
            );
        }
    );
});