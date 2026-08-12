import { Page, expect, Locator } from '@playwright/test';

export class TaskBotPage {
    constructor(private page: Page) {}

    // ============================================================
    // CREATE TASK BOT
    // ============================================================

    async createTaskBot(botName: string) {
        console.log(`Creating Task Bot: ${botName}`);

        // Find Create button
        const createButton = this.page
            .getByRole('button', { name: /Create/i })
            .first();

        if (await createButton.count() > 0) {
            await expect(createButton).toBeVisible({
                timeout: 15000
            });

            await createButton.click();
        } else {
            const createText = this.page
                .getByText('Create', { exact: true })
                .first();

            await expect(createText).toBeVisible({
                timeout: 15000
            });

            await createText.click();
        }

        // Wait for Create Task Bot dialog
        await expect(
            this.page.getByText('Create Task Bot', {
                exact: true
            })
        ).toBeVisible({
            timeout: 15000
        });

        console.log('Create Task Bot dialog found');

        // Name
        const nameInput = this.page.getByRole('textbox', {
            name: 'Name'
        });

        await expect(nameInput).toBeVisible({
            timeout: 10000
        });

        await nameInput.fill(botName);

        // Description
        const descriptionInput = this.page.getByRole(
            'textbox',
            {
                name: 'Description (optional)'
            }
        );

        if (await descriptionInput.count() > 0) {
            await descriptionInput.fill(
                'Playwright Message Box automation test'
            );
        }

        // Create & edit
        const createEditButton = this.page.getByRole(
            'button',
            {
                name: 'Create & edit'
            }
        );

        await expect(createEditButton).toBeVisible({
            timeout: 10000
        });

        await createEditButton.click();

        // Wait for Task Bot editor
        await this.page.waitForURL(
            /\/files\/task\/\d+\/edit/,
            {
                timeout: 30000
            }
        );

        console.log(
            `Task Bot editor URL: ${this.page.url()}`
        );

        await this.waitForEditor();

        console.log(`Created Task Bot: ${botName}`);
    }


    // ============================================================
    // WAIT FOR TASK BOT EDITOR
    // ============================================================

    async waitForEditor() {
        console.log('Waiting for Task Bot editor...');

        await this.page.waitForURL(
            /\/files\/task\/\d+\/edit/,
            {
                timeout: 30000
            }
        );

        // Give the SPA some time to render.
        await this.page.waitForTimeout(2000);

        const actionsPanel = this.page.getByRole(
            'region',
            {
                name: 'Actions'
            }
        );

        if (await actionsPanel.count() > 0) {
            try {
                await expect(actionsPanel).toBeVisible({
                    timeout: 30000
                });

                console.log('Actions panel found');
                return;
            } catch {
                // Continue to fallback.
            }
        }

        const actionsText = this.page.getByText(
            'Actions',
            {
                exact: true
            }
        ).first();

        await expect(actionsText).toBeVisible({
            timeout: 30000
        });

        console.log('Actions panel found');
    }


    // ============================================================
    // VERIFY TASK BOT EDITOR
    // ============================================================

    async verifyTaskBotEditor() {
        await this.waitForEditor();

        const actionsPanel = this.page.getByRole(
            'region',
            {
                name: 'Actions'
            }
        );

        if (await actionsPanel.count() > 0) {
            await expect(actionsPanel).toBeVisible({
                timeout: 30000
            });
        } else {
            await expect(
                this.page.getByText(
                    'Actions',
                    {
                        exact: true
                    }
                ).first()
            ).toBeVisible({
                timeout: 30000
            });
        }

        console.log('Task Bot editor verified');
    }


    // ============================================================
    // GET ACTIONS PANEL
    // ============================================================

    private async getActionsPanel(): Promise<Locator> {
        const panel = this.page.getByRole(
            'region',
            {
                name: 'Actions'
            }
        );

        if (await panel.count() > 0) {
            return panel;
        }

        return this.page.locator(
            '[aria-label="Actions"]'
        ).first();
    }


    // ============================================================
    // ADD MESSAGE BOX
    // ============================================================

    async addMessageBox() {
        console.log('Waiting for Actions panel...');

        const actionsPanel = await this.getActionsPanel();

        if (await actionsPanel.count() > 0) {
            try {
                await expect(actionsPanel).toBeVisible({
                    timeout: 15000
                });

                console.log('Actions panel found');
            } catch {
                console.log(
                    'Actions panel locator found but not visible'
                );
            }
        }

        // --------------------------------------------------------
        // Find Message Box category
        // --------------------------------------------------------

        let messageBoxCategory = actionsPanel.getByRole(
            'button',
            {
                name: 'Message box',
                exact: true
            }
        );

        if (await messageBoxCategory.count() === 0) {
            messageBoxCategory = this.page.getByRole(
                'button',
                {
                    name: 'Message box',
                    exact: true
                }
            );
        }

        await expect(
            messageBoxCategory.first()
        ).toBeVisible({
            timeout: 15000
        });

        console.log('Message Box category found');

        // --------------------------------------------------------
        // Expand Message Box category
        // --------------------------------------------------------

        const category = messageBoxCategory.first();

        const expanded = await category.getAttribute(
            'aria-expanded'
        );

        if (expanded !== 'true') {
            await category.click();
            await this.page.waitForTimeout(500);
        }

        // --------------------------------------------------------
        // Locate actual Message Box action
        // --------------------------------------------------------

        let messageBoxItem = actionsPanel.locator(
            'button[name="item-button"][aria-label="Message box"]'
        );

        if (await messageBoxItem.count() === 0) {
            messageBoxItem = this.page.locator(
                'button[name="item-button"][aria-label="Message box"]'
            );
        }

        await expect(
            messageBoxItem.first()
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            `Message Box buttons found: ${await messageBoxItem.count()}`
        );

        // --------------------------------------------------------
        // Add Message Box
        // --------------------------------------------------------

        const action = messageBoxItem.first();

        // Double click is what worked with the recorder in your
        // earlier successful run.
        await action.dblclick();

        console.log('Message Box action added');

        // Wait for SPA to update.
        await this.page.waitForTimeout(2000);

        // --------------------------------------------------------
        // Locate Message Box in the flow
        // --------------------------------------------------------

        const messageBoxText = this.page.getByText(
            'Message box',
            {
                exact: true
            }
        );

        const count = await messageBoxText.count();

        console.log(
            `Message Box text elements after adding: ${count}`
        );

        if (count < 2) {
            // Sometimes the canvas renders slowly.
            await this.page.waitForTimeout(3000);
        }

        const updatedCount = await messageBoxText.count();

        if (updatedCount < 2) {
            throw new Error(
                'Message Box was added to the palette but could not be found in the Task Bot flow.'
            );
        }

        // The last Message Box is normally the one in the flow.
        const flowMessageBox = messageBoxText.last();

        await expect(flowMessageBox).toBeVisible({
            timeout: 15000
        });

        // --------------------------------------------------------
        // IMPORTANT:
        // Select the Message Box action in the FLOW.
        // This opens its configuration panel.
        // --------------------------------------------------------

        await flowMessageBox.click();

        console.log(
            'Message Box flow action selected'
        );

        await this.page.waitForTimeout(1500);

        // Some versions need a second click to open
        // the configuration properties.
        const configurationHeading = this.page.getByText(
            'Enter the message box window title',
            {
                exact: true
            }
        );

        if (await configurationHeading.count() === 0) {
            await flowMessageBox.click();
            await this.page.waitForTimeout(1000);
        }

        // --------------------------------------------------------
        // Wait for configuration panel
        // --------------------------------------------------------

        await expect(
            this.page.getByText(
                'Enter the message box window title',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 20000
        });

        console.log(
            'Message Box configuration panel opened'
        );
    }


    // ============================================================
    // FIND INPUT BY CURRENT VALUE
    // ============================================================

    private async findInputByValue(
        possibleValues: string[]
    ): Promise<Locator | null> {

        const inputs = this.page.locator(
            'input:not([type="hidden"])'
        );

        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
            const input = inputs.nth(i);

            try {
                if (!(await input.isVisible())) {
                    continue;
                }

                const value = await input.inputValue();

                if (possibleValues.includes(value)) {
                    return input;
                }
            } catch {
                continue;
            }
        }

        return null;
    }


    // ============================================================
    // FIND TEXTAREA / EDITABLE
    // ============================================================

    private async findEditableWithText(
        possibleTexts: string[]
    ): Promise<Locator | null> {

        // --------------------------------------------------------
        // Textareas
        // --------------------------------------------------------

        const textareas = this.page.locator(
            'textarea'
        );

        const textareaCount = await textareas.count();

        for (let i = 0; i < textareaCount; i++) {
            const textarea = textareas.nth(i);

            try {
                if (!(await textarea.isVisible())) {
                    continue;
                }

                const value = await textarea.inputValue();

                if (possibleTexts.includes(value)) {
                    return textarea;
                }
            } catch {
                continue;
            }
        }

        // --------------------------------------------------------
        // Contenteditable
        // --------------------------------------------------------

        const editables = this.page.locator(
            '[contenteditable="true"]'
        );

        const editableCount = await editables.count();

        for (let i = 0; i < editableCount; i++) {
            const editable = editables.nth(i);

            try {
                if (!(await editable.isVisible())) {
                    continue;
                }

                const text = await editable.innerText();

                if (
                    possibleTexts.includes(text) ||
                    possibleTexts.some(
                        value => text.includes(value)
                    )
                ) {
                    return editable;
                }
            } catch {
                continue;
            }
        }

        return null;
    }


    // ============================================================
    // CONFIGURE MESSAGE BOX
    // ============================================================

    async configureMessageBox() {
        console.log('Configuring Message Box...');

        // --------------------------------------------------------
        // Make sure configuration panel is open
        // --------------------------------------------------------

        const configurationHeading = this.page.getByText(
            'Enter the message box window title',
            {
                exact: true
            }
        );

        await expect(
            configurationHeading
        ).toBeVisible({
            timeout: 20000
        });

        console.log(
            'Message Box configuration panel found'
        );

        // --------------------------------------------------------
        // WINDOW TITLE
        // --------------------------------------------------------

        const titleValue =
            'Automation Anywhere Enterprise Client';

        const newTitle =
            'Playwright Message Box';

        let titleInput =
            await this.findInputByValue([
                titleValue,
                'Automation Anywhere',
                ''
            ]);

        // We prefer the known default value.
        // If an empty input was returned, make sure it is
        // actually near the title label before using it.
        if (
            titleInput &&
            (await titleInput.inputValue()) === ''
        ) {
            const inputs = this.page.locator(
                'input:not([type="hidden"])'
            );

            const count = await inputs.count();

            let betterInput: Locator | null = null;

            for (let i = 0; i < count; i++) {
                const input = inputs.nth(i);

                try {
                    if (!(await input.isVisible())) {
                        continue;
                    }

                    const type =
                        await input.getAttribute('type');

                    if (type === 'number') {
                        continue;
                    }

                    const value =
                        await input.inputValue();

                    if (
                        value ===
                        'Automation Anywhere Enterprise Client'
                    ) {
                        betterInput = input;
                        break;
                    }
                } catch {
                    continue;
                }
            }

            if (betterInput) {
                titleInput = betterInput;
            }
        }

        if (titleInput) {
            await titleInput.click();

            await titleInput.fill(
                newTitle
            );

            await expect(
                titleInput
            ).toHaveValue(
                newTitle
            );

            console.log(
                'Window title configured'
            );
        } else {
            // ----------------------------------------------------
            // Contenteditable fallback
            // ----------------------------------------------------

            const editable =
                await this.findEditableWithText([
                    titleValue,
                    'Automation Anywhere'
                ]);

            if (!editable) {
                throw new Error(
                    'Could not locate Message Box window title field.'
                );
            }

            await editable.click();

            await editable.press(
                'ControlOrMeta+A'
            );

            await editable.fill(
                newTitle
            );

            console.log(
                'Window title configured using editable field'
            );
        }

        // --------------------------------------------------------
        // MESSAGE
        // --------------------------------------------------------

        const messageLabel =
            this.page.getByText(
                'Enter the message to display',
                {
                    exact: true
                }
            );

        await expect(
            messageLabel
        ).toBeVisible({
            timeout: 15000
        });

        const message =
            'Hello from Playwright automation';

        let messageInput: Locator | null = null;

        // --------------------------------------------------------
        // Look for empty textarea first
        // --------------------------------------------------------

        const textareas =
            this.page.locator(
                'textarea'
            );

        const textareaCount =
            await textareas.count();

        for (let i = 0; i < textareaCount; i++) {
            const textarea =
                textareas.nth(i);

            try {
                if (
                    await textarea.isVisible()
                ) {
                    messageInput = textarea;
                    break;
                }
            } catch {
                continue;
            }
        }

        // --------------------------------------------------------
        // Look for suitable input
        // --------------------------------------------------------

        if (!messageInput) {
            const inputs =
                this.page.locator(
                    'input:not([type="hidden"])'
                );

            const inputCount =
                await inputs.count();

            for (let i = 0; i < inputCount; i++) {
                const input =
                    inputs.nth(i);

                try {
                    if (
                        !(await input.isVisible())
                    ) {
                        continue;
                    }

                    const type =
                        await input.getAttribute(
                            'type'
                        );

                    if (
                        type === 'number' ||
                        type === 'checkbox' ||
                        type === 'radio'
                    ) {
                        continue;
                    }

                    const value =
                        await input.inputValue();

                    if (
                        value === '' ||
                        value === 'Required'
                    ) {
                        messageInput = input;
                        break;
                    }
                } catch {
                    continue;
                }
            }
        }

        // --------------------------------------------------------
        // Fill message
        // --------------------------------------------------------

        if (messageInput) {
            await messageInput.click();

            await messageInput.fill(
                message
            );

            // Only use toHaveValue for actual form controls.
            const tagName =
                await messageInput.evaluate(
                    el => el.tagName
                );

            if (
                tagName === 'INPUT' ||
                tagName === 'TEXTAREA'
            ) {
                await expect(
                    messageInput
                ).toHaveValue(
                    message
                );
            }

            console.log(
                'Message configured'
            );
        } else {
            // ----------------------------------------------------
            // Contenteditable fallback
            // ----------------------------------------------------

            const editables =
                this.page.locator(
                    '[contenteditable="true"]'
                );

            const editableCount =
                await editables.count();

            let foundEditable = false;

            for (
                let i = 0;
                i < editableCount;
                i++
            ) {
                const editable =
                    editables.nth(i);

                try {
                    if (
                        !(await editable.isVisible())
                    ) {
                        continue;
                    }

                    const text =
                        await editable.innerText();

                    if (
                        text === '' ||
                        text === 'Required'
                    ) {
                        await editable.click();

                        await editable.press(
                            'ControlOrMeta+A'
                        );

                        await editable.fill(
                            message
                        );

                        foundEditable = true;

                        console.log(
                            'Message configured using contenteditable'
                        );

                        break;
                    }
                } catch {
                    continue;
                }
            }

            if (!foundEditable) {
                throw new Error(
                    'Could not locate Message Box message field.'
                );
            }
        }

        // --------------------------------------------------------
        // CLOSE MESSAGE BOX AFTER
        // --------------------------------------------------------

        const closeOption =
            this.page.getByText(
                'Close message box after',
                {
                    exact: false
                }
            ).first();

        if (
            await closeOption.count() > 0
        ) {
            try {
                await expect(
                    closeOption
                ).toBeVisible({
                    timeout: 5000
                });

                // Click only if this is a selectable label.
                await closeOption.click();

                console.log(
                    'Close message box after option selected'
                );
            } catch {
                console.log(
                    'Close message box after option was not selected'
                );
            }
        }

        // --------------------------------------------------------
        // SET CLOSE DURATION TO 10
        // --------------------------------------------------------

        const numberInputs =
            this.page.locator(
                'input[type="number"]'
            );

        const numberCount =
            await numberInputs.count();

        if (numberCount > 0) {
            console.log(
                `Number inputs found: ${numberCount}`
            );

            for (
                let i = 0;
                i < numberCount;
                i++
            ) {
                const numberInput =
                    numberInputs.nth(i);

                try {
                    if (
                        !(await numberInput.isVisible())
                    ) {
                        continue;
                    }

                    if (
                        await numberInput.isDisabled()
                    ) {
                        continue;
                    }

                    await numberInput.fill(
                        '10'
                    );

                    console.log(
                        'Close duration set to 10 seconds'
                    );

                    break;
                } catch {
                    continue;
                }
            }
        }

        // --------------------------------------------------------
        // Final small wait for React/SPA state update
        // --------------------------------------------------------

        await this.page.waitForTimeout(
            1000
        );

        console.log(
            'Message Box configuration completed'
        );
    }


    // ============================================================
    // SAVE TASK BOT
    // ============================================================

    async save() {
        console.log('Saving Task Bot...');

        const saveButton =
            this.page.getByRole(
                'button',
                {
                    name: 'Save',
                    exact: true
                }
            );

        await expect(
            saveButton
        ).toBeVisible({
            timeout: 15000
        });

        await saveButton.click();

        console.log(
            'Save button clicked'
        );

        await this.page.waitForTimeout(
            2000
        );
    }


    // ============================================================
    // VERIFY MESSAGE BOX CONFIGURATION
    // ============================================================

    async verifyMessageBoxConfiguration() {
        const title =
            this.page.getByText(
                'Playwright Message Box',
                {
                    exact: true
                }
            );

        const message =
            this.page.getByText(
                'Hello from Playwright automation',
                {
                    exact: true
                }
            );

        // The values might be inside input fields instead
        // of normal text nodes, so first try text.
        const titleVisible =
            await title.count() > 0 &&
            await title.first().isVisible();

        const messageVisible =
            await message.count() > 0 &&
            await message.first().isVisible();

        if (titleVisible && messageVisible) {
            console.log(
                'Message Box configuration verified'
            );

            return;
        }

        // --------------------------------------------------------
        // Input value fallback
        // --------------------------------------------------------

       const titleInput = this.page.locator(
    'input'
).filter({
    has: this.page.locator(
        '[value="Playwright Message Box"]'
    )
});

const messageInput = this.page.locator(
    'input'
).filter({
    has: this.page.locator(
        '[value="Hello from Playwright automation"]'
    )
});

        const titleInputFound =
            await titleInput.count() > 0;

        const messageInputFound =
            await messageInput.count() > 0;

        if (
            titleInputFound ||
            messageInputFound
        ) {
            console.log(
                'Message Box configuration verified through input values'
            );

            return;
        }

        // --------------------------------------------------------
        // Last fallback: search all form controls
        // --------------------------------------------------------

        const allControls =
            this.page.locator(
                'input, textarea, [contenteditable="true"]'
            );

        const count =
            await allControls.count();

        let foundTitle = false;
        let foundMessage = false;

        for (
            let i = 0;
            i < count;
            i++
        ) {
            const control =
                allControls.nth(i);

            try {
                if (
                    !(await control.isVisible())
                ) {
                    continue;
                }

                const tag =
                    await control.evaluate(
                        el => el.tagName
                    );

                if (
                    tag === 'INPUT' ||
                    tag === 'TEXTAREA'
                ) {
                    const value =
                        await control.inputValue();

                    if (
                        value ===
                        'Playwright Message Box'
                    ) {
                        foundTitle = true;
                    }

                    if (
                        value ===
                        'Hello from Playwright automation'
                    ) {
                        foundMessage = true;
                    }
                } else {
                    const text =
                        await control.innerText();

                    if (
                        text.includes(
                            'Playwright Message Box'
                        )
                    ) {
                        foundTitle = true;
                    }

                    if (
                        text.includes(
                            'Hello from Playwright automation'
                        )
                    ) {
                        foundMessage = true;
                    }
                }
            } catch {
                continue;
            }
        }

        if (
            foundTitle &&
            foundMessage
        ) {
            console.log(
                'Message Box configuration verified'
            );

            return;
        }

        throw new Error(
            'Message Box configuration could not be verified.'
        );
    }
}