import { expect, Page, Frame, Locator } from '@playwright/test';

export class FormPage {
    readonly page: Page;
    private formBuilderFrame!: Frame;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================================
    // CREATE A FRESH FORM
    // ============================================================

    async createFreshForm(formName: string): Promise<void> {
        console.log('\nCreating fresh Form:', formName);

        const repositoryUrl =
            'https://community.cloud.automationanywhere.digital/#/bots/repository/private/folders/33091272';

        console.log('Opening Automation repository...');

        try {
            await this.page.goto(repositoryUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 60_000
            });
        } catch {
            console.log(
                'Repository navigation timed out; continuing to wait for UI.'
            );
        }

        await this.page.waitForTimeout(5_000);

        const findVisibleCreate = async (): Promise<Locator | null> => {
            const candidates: Locator[] = [
                this.page.locator(
                    'button[name="createOptions"][aria-label="Create"]'
                ),

                this.page.locator(
                    '[name="createOptions"][aria-label="Create"]'
                ),

                this.page.getByRole('button', {
                    name: 'Create',
                    exact: true
                }),

                this.page.getByText('Create', {
                    exact: true
                })
            ];

            for (const candidate of candidates) {
                const count =
                    await candidate.count().catch(() => 0);

                for (let i = 0; i < count; i++) {
                    const element = candidate.nth(i);

                    if (
                        await element
                            .isVisible()
                            .catch(() => false)
                    ) {
                        return element;
                    }
                }
            }

            return null;
        };

        let createButton =
            await findVisibleCreate();

        for (
            let attempt = 1;
            attempt <= 5 && !createButton;
            attempt++
        ) {
            console.log(
                `Waiting for repository UI... attempt ${attempt}/5`
            );

            await this.page.waitForTimeout(3_000);

            createButton =
                await findVisibleCreate();
        }

        if (!createButton) {
            console.log(
                'Create button not found. Reloading repository...'
            );

            try {
                await this.page.reload({
                    waitUntil: 'domcontentloaded',
                    timeout: 60_000
                });
            } catch {
                console.log(
                    'Repository reload timed out.'
                );
            }

            await this.page.waitForTimeout(5_000);

            createButton =
                await findVisibleCreate();
        }

        if (!createButton) {
            throw new Error(
                'Create button could not be found.'
            );
        }

        await createButton.click({
            force: true
        });

        console.log('Create clicked');

        // --------------------------------------------------------
        // SELECT FORM
        // --------------------------------------------------------

        const formCandidates: Locator[] = [
            this.page.locator(
                '[name="create-attended-form"]'
            ),

            this.page.getByRole('menuitem', {
                name: /Form/
            }),

            this.page.getByText('Form…', {
                exact: true
            }),

            this.page.getByText('Form', {
                exact: true
            })
        ];

        let formOption: Locator | null = null;

        for (const candidate of formCandidates) {
            const count =
                await candidate.count().catch(() => 0);

            for (let i = 0; i < count; i++) {
                const element = candidate.nth(i);

                if (
                    await element
                        .isVisible()
                        .catch(() => false)
                ) {
                    formOption = element;
                    break;
                }
            }

            if (formOption) {
                break;
            }
        }

        if (!formOption) {
            throw new Error(
                'Form option could not be found.'
            );
        }

        await formOption.click({
            force: true
        });

        await this.page.waitForTimeout(2_000);

        // --------------------------------------------------------
        // FORM NAME
        // --------------------------------------------------------

        const nameCandidates: Locator[] = [
            this.page.getByRole('textbox', {
                name: 'Name',
                exact: true
            }),

            this.page.locator(
                'input[name="name"]:visible'
            ),

            this.page.locator(
                'input[placeholder="Name"]:visible'
            ),

            this.page.locator(
                'input[type="text"]:visible'
            )
        ];

        let nameInput: Locator | null = null;

        for (const candidate of nameCandidates) {
            const count =
                await candidate.count().catch(() => 0);

            for (let i = 0; i < count; i++) {
                const element = candidate.nth(i);

                if (
                    await element
                        .isVisible()
                        .catch(() => false)
                ) {
                    nameInput = element;
                    break;
                }
            }

            if (nameInput) {
                break;
            }
        }

        if (!nameInput) {
            throw new Error(
                'Form Name input could not be found.'
            );
        }

        await nameInput.fill(formName);

        console.log(
            'Form name entered:',
            formName
        );

        // --------------------------------------------------------
        // CREATE & EDIT
        // --------------------------------------------------------

        const createEditCandidates: Locator[] = [
            this.page.getByRole('button', {
                name: 'Create & edit',
                exact: true
            }),

            this.page.getByText('Create & edit', {
                exact: true
            }),

            this.page.locator('button').filter({
                hasText: 'Create & edit'
            })
        ];

        let createEdit: Locator | null = null;

        for (const candidate of createEditCandidates) {
            const count =
                await candidate.count().catch(() => 0);

            for (let i = 0; i < count; i++) {
                const element = candidate.nth(i);

                if (
                    await element
                        .isVisible()
                        .catch(() => false)
                ) {
                    createEdit = element;
                    break;
                }
            }

            if (createEdit) {
                break;
            }
        }

        if (!createEdit) {
            throw new Error(
                'Create & edit button could not be found.'
            );
        }

        await createEdit.click({
            force: true
        });

        console.log(
            'Create & edit clicked'
        );

        await this.page.waitForTimeout(
            10_000
        );

        await expect(
            this.page
        ).toHaveURL(
            /\/module\/attended\/form\/edit/,
            {
                timeout: 30_000
            }
        );

        console.log(
            '✓ Fresh Form Builder opened'
        );
    }

    // ============================================================
    // FIND FORM BUILDER FRAME
    // ============================================================

    async findFormBuilderFrame(): Promise<Frame> {
        console.log(
            '\nFinding Form Builder iframe...'
        );

        for (const frame of this.page.frames()) {

            console.log(
                'FRAME:',
                frame.url()
            );

            if (
                frame.url().includes(
                    '/modules/attended/'
                )
            ) {
                this.formBuilderFrame = frame;

                await frame
                    .locator('body')
                    .waitFor({
                        state: 'visible',
                        timeout: 30_000
                    });

                console.log(
                    '✓ Form Builder frame found'
                );

                return frame;
            }
        }

        throw new Error(
            'Form Builder iframe was not found.'
        );
    }

    // ============================================================
    // GET FRAME
    // ============================================================

    getFrame(): Frame {
        if (!this.formBuilderFrame) {
            throw new Error(
                'Form Builder frame has not been initialized.'
            );
        }

        return this.formBuilderFrame;
    }

    // ============================================================
    // VERIFY TEXT BOX AVAILABLE
    // ============================================================

    async verifyTextBoxAvailable(): Promise<void> {
        const frame = this.getFrame();

        const textBox = frame
            .locator(
                '[data-path="EditorPalette.item"]'
            )
            .filter({
                hasText: 'Text Box'
            })
            .first();

        await expect(
            textBox
        ).toBeVisible({
            timeout: 20_000
        });

        console.log(
            '✓ Text Box is available'
        );
    }

    // ============================================================
    // ADD TEXT BOX
    // ============================================================

    async addTextBox(): Promise<void> {
        const frame = this.getFrame();

        const textBox = frame
            .locator(
                '[data-path="EditorPalette.item"]'
            )
            .filter({
                hasText: 'Text Box'
            })
            .first();

        await expect(
            textBox
        ).toBeVisible({
            timeout: 20_000
        });

        const canvas = frame
            .locator(
                '[data-path="content"]'
            )
            .first();

        await expect(
            canvas
        ).toBeVisible({
            timeout: 20_000
        });

        await textBox.scrollIntoViewIfNeeded();
        await canvas.scrollIntoViewIfNeeded();

        const source =
            await textBox.boundingBox();

        const target =
            await canvas.boundingBox();

        if (!source) {
            throw new Error(
                'Text Box bounding box could not be determined.'
            );
        }

        if (!target) {
            throw new Error(
                'Canvas bounding box could not be determined.'
            );
        }

        const sourceX =
            source.x +
            source.width / 2;

        const sourceY =
            source.y +
            source.height / 2;

        const targetX =
            target.x +
            Math.min(
                target.width / 2,
                300
            );

        const targetY =
            target.y +
            Math.min(
                target.height / 2,
                200
            );

        await this.page.mouse.move(
            sourceX,
            sourceY
        );

        await this.page.mouse.down();

        await this.page.mouse.move(
            targetX,
            targetY,
            {
                steps: 20
            }
        );

        await this.page.mouse.up();

        await this.page.waitForTimeout(
            2_000
        );

        console.log(
            '✓ Text Box added'
        );
    }

    // ============================================================
    // ADD TWO TEXT BOXES
    // ============================================================

    async addTwoTextBoxes(): Promise<void> {

        console.log(
            '\nAdding first Text Box...'
        );

        await this.addTextBox();

        await this.page.waitForTimeout(
            1_500
        );

        console.log(
            '\nAdding second Text Box...'
        );

        await this.addTextBox();

        await this.page.waitForTimeout(
            2_000
        );

        console.log(
            '✓ Two Text Boxes added'
        );
    }

    // ============================================================
    // SELECT TEXT BOX
    // ============================================================

    async selectTextBox(
        index: number
    ): Promise<void> {

        const frame =
            this.getFrame();

        const canvas =
            frame
                .locator(
                    '[data-path="content"]'
                )
                .first();

        await expect(
            canvas
        ).toBeVisible({
            timeout: 20_000
        });

        if (index === 0) {

            const textBoxes =
                frame.locator(
                    'input[aria-label="TextBox"]'
                );

            const count =
                await textBoxes.count();

            if (count === 0) {
                throw new Error(
                    'Could not find Text Box 1.'
                );
            }

            await textBoxes
                .first()
                .click({
                    force: true
                });

        } else if (index === 1) {

            const canvasElements =
                canvas.locator('*');

            const count =
                await canvasElements.count();

            let clicked = false;

            for (
                let i = 0;
                i < count;
                i++
            ) {

                const element =
                    canvasElements.nth(i);

                if (
                    !(await element
                        .isVisible()
                        .catch(() => false))
                ) {
                    continue;
                }

                const text =
                    await element
                        .innerText()
                        .catch(() => '');

                const aria =
                    await element
                        .getAttribute(
                            'aria-label'
                        )
                        .catch(() => null);

                const name =
                    await element
                        .getAttribute(
                            'name'
                        )
                        .catch(() => null);

                const dataPath =
                    await element
                        .getAttribute(
                            'data-path'
                        )
                        .catch(() => null);

                const combined =
                    `${text} ${aria ?? ''} ${name ?? ''} ${dataPath ?? ''}`;

                if (
                    /TextBox/i.test(
                        combined
                    )
                ) {

                    try {

                        await element
                            .scrollIntoViewIfNeeded();

                        await element.click({
                            force: true
                        });

                        clicked = true;

                        break;

                    } catch {
                        // Continue
                    }
                }
            }

            if (!clicked) {

                const candidates = [
                    canvas.getByText(
                        'TextBox',
                        {
                            exact: true
                        }
                    ),

                    canvas.getByText(
                        'Text Box',
                        {
                            exact: true
                        }
                    ),

                    canvas.getByText(
                        'Status',
                        {
                            exact: true
                        }
                    )
                ];

                for (
                    const candidate of candidates
                ) {

                    const count =
                        await candidate
                            .count()
                            .catch(
                                () => 0
                            );

                    for (
                        let i = 0;
                        i < count;
                        i++
                    ) {

                        const element =
                            candidate.nth(i);

                        if (
                            await element
                                .isVisible()
                                .catch(
                                    () => false
                                )
                        ) {

                            try {

                                await element
                                    .scrollIntoViewIfNeeded();

                                await element.click({
                                    force: true
                                });

                                clicked = true;

                                break;

                            } catch {
                                // Continue
                            }
                        }
                    }

                    if (clicked) {
                        break;
                    }
                }
            }

            if (!clicked) {
                throw new Error(
                    'Could not find Text Box 2.'
                );
            }

        } else {

            throw new Error(
                `Unsupported Text Box index: ${index}`
            );
        }

        await expect(
            frame.locator(
                'input[name="label"]'
            )
        ).toBeVisible({
            timeout: 20_000
        });

        console.log(
            `✓ Text Box ${index + 1} selected`
        );
    }

    // ============================================================
    // CONFIGURE TEXT BOX
    // ============================================================

    async setTextBoxProperties(
        index: number,
        properties: {
            label: string;
            defaultValue: string;
            minLength: string;
            maxLength: string;
            hintText: string;
            toolTip: string;
        }
    ): Promise<void> {

        const frame =
            this.getFrame();

        await this.selectTextBox(
            index
        );

        const labelInput =
            frame.locator(
                'input[name="label"]'
            );

        await expect(
            labelInput
        ).toBeVisible({
            timeout: 15_000
        });

        await labelInput.fill(
            properties.label
        );

        await expect(
            labelInput
        ).toHaveValue(
            properties.label
        );

        const defaultInput =
            frame.locator(
                'input[name="defaultValue"]'
            );

        await expect(
            defaultInput
        ).toBeVisible({
            timeout: 15_000
        });

        await defaultInput.fill(
            properties.defaultValue
        );

        const minInput =
            frame.locator(
                'input[name="minLength"]'
            );

        await expect(
            minInput
        ).toBeVisible({
            timeout: 15_000
        });

        await minInput.fill(
            properties.minLength
        );

        const maxInput =
            frame.locator(
                'input[name="maxLength"]'
            );

        await expect(
            maxInput
        ).toBeVisible({
            timeout: 15_000
        });

        await maxInput.fill(
            properties.maxLength
        );

        const hintInput =
            frame.locator(
                'input[name="hintText"]'
            );

        await expect(
            hintInput
        ).toBeVisible({
            timeout: 15_000
        });

        await hintInput.fill(
            properties.hintText
        );

        const tooltip =
            frame.locator(
                'textarea[name="toolTip"]'
            );

        await expect(
            tooltip
        ).toBeVisible({
            timeout: 15_000
        });

        await tooltip.fill(
            properties.toolTip
        );

        console.log(
            `✓ Text Box ${index + 1} configured`
        );
    }

    // ============================================================
    // CONFIGURE BOTH TEXT BOXES
    // ============================================================

    async configureBothTextBoxes(): Promise<void> {

        await this.setTextBoxProperties(
            0,
            {
                label: 'Name',
                defaultValue: 'Sushant',
                minLength: '3',
                maxLength: '30',
                hintText: 'Enter your name',
                toolTip: 'Enter the full name'
            }
        );

        await this.setTextBoxProperties(
            1,
            {
                label: 'Status',
                defaultValue: 'Pending',
                minLength: '3',
                maxLength: '30',
                hintText: 'Enter the status',
                toolTip: 'Enter the current status'
            }
        );

        console.log(
            '\n✓ BOTH TEXT BOXES CONFIGURED'
        );
    }

    // ============================================================
    // OPEN RULES BUILDER
    // ============================================================

    async openRulesBuilder(): Promise<void> {

        const frame =
            this.getFrame();

        const candidates: Locator[] = [

            frame.getByText(
                /Form rules/,
                {
                    exact: false
                }
            ),

            frame.locator(
                '[data-path="EditorTabs.tab"]'
            ).filter({
                hasText: 'Form rules'
            }),

            frame.locator(
                '[role="tab"]'
            ).filter({
                hasText: 'Form rules'
            })
        ];

        let rulesTab: Locator | null = null;

        for (
            const candidate of candidates
        ) {

            const count =
                await candidate
                    .count()
                    .catch(
                        () => 0
                    );

            for (
                let i = 0;
                i < count;
                i++
            ) {

                const item =
                    candidate.nth(i);

                if (
                    await item
                        .isVisible()
                        .catch(
                            () => false
                        )
                ) {

                    rulesTab = item;

                    break;
                }
            }

            if (rulesTab) {
                break;
            }
        }

        if (!rulesTab) {
            throw new Error(
                'Form rules tab could not be found.'
            );
        }

        await rulesTab.scrollIntoViewIfNeeded();

        await rulesTab.click({
            force: true
        });

        await this.page.waitForTimeout(
            2_000
        );

        console.log(
            '✓ Form Rules opened'
        );
    }

    private async firstVisible(candidates: Locator[]): Promise<Locator | null> {
        for (const candidate of candidates) {
            const count = await candidate.count().catch(() => 0);
            for (let i = 0; i < count; i++) {
                const item = candidate.nth(i);
                if (await item.isVisible().catch(() => false)) {
                    return item;
                }
            }
        }
        return null;
    }

    private async getLastVisibleRioToggle(): Promise<Locator | null> {
        const frame = this.getFrame();
        const toggles = frame.locator(
            '[data-path="RioSelectInputQuery.toggle-button"]:visible'
        );
        const count = await toggles.count().catch(() => 0);
        if (count > 0) {
            return toggles.last();
        }

        const fallback = frame.locator(
            'button[aria-haspopup="listbox"]:visible, [role="combobox"]:visible'
        );
        const fallbackCount = await fallback.count().catch(() => 0);
        if (fallbackCount > 0) {
            return fallback.last();
        }

        return null;
    }

    private async clickRuleOption(text: string): Promise<void> {
        const frame = this.getFrame();
        const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^\\s*${escaped}\\s*$`, 'i');

        // Automation Anywhere's RioSelectInputQuery is not a native
        // <select>. When opened, it can expose a search input and the
        // option list in a popup. Use the search field first because it
        // is much more stable than relying on role=option.
        const visibleSearches = frame.locator(
            '[data-path="RioSelectInputQuery.search-input"]:visible'
        );
        const searchCount = await visibleSearches.count().catch(() => 0);

        if (searchCount > 0) {
            const search = visibleSearches.last();
            try {
                await search.fill(text);
                await this.page.waitForTimeout(400);
            } catch {
                // Continue with normal option lookup.
            }
        }

        const candidates: Locator[] = [
            frame.locator('[role="option"]:visible').filter({ hasText: regex }),
            frame.locator('[role="menuitem"]:visible').filter({ hasText: regex }),
            frame.locator('[data-path*="option" i]:visible').filter({ hasText: regex }),
            frame.locator('li:visible').filter({ hasText: regex }),
            frame.locator('button:visible').filter({ hasText: regex }),
            frame.locator('label:visible').filter({ hasText: regex }),
            frame.getByText(text, { exact: true })
        ];

        let option = await this.firstVisible(candidates);

        // Some AA builds render dropdown choices as a RioSelectInputQuery
        // item/container rather than an ARIA option.
        if (!option) {
            const rioItems = frame.locator(
                '[data-path="RioSelectInputQuery"]:visible'
            );
            const count = await rioItems.count().catch(() => 0);

            for (let i = 0; i < count; i++) {
                const item = rioItems.nth(i);
                const itemText = await item.innerText().catch(() => '');
                if (new RegExp(`^\\s*${escaped}\\s*$`, 'i').test(itemText)) {
                    option = item;
                    break;
                }
            }
        }

        if (!option) {
            const body = await frame.locator('body').innerText().catch(() => '');
            throw new Error(
                `Rules Builder option "${text}" was not found.\n` +
                body.slice(-8000)
            );
        }

        await option.scrollIntoViewIfNeeded();
        await option.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async clickConditionOperator(
        elementInput: Locator
    ): Promise<void> {
        const frame = this.getFrame();
        const inputBox = await elementInput.boundingBox();
        if (!inputBox) {
            throw new Error('Condition element selector bounding box could not be determined.');
        }

        const containers = frame.locator(
            '[data-path="RioSelectInputQuery"]:visible'
        );
        const containerCount = await containers.count().catch(() => 0);

        let best: Locator | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        for (let i = 0; i < containerCount; i++) {
            const candidate = containers.nth(i);
            const box = await candidate.boundingBox().catch(() => null);
            if (!box) continue;

            const sameRow = Math.abs(box.y - inputBox.y) < 90;
            const toRight = box.x > inputBox.x + 20;

            if (sameRow && toRight) {
                const distance = Math.abs(box.y - inputBox.y) + Math.abs(box.x - inputBox.x);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    best = candidate;
                }
            }
        }

        if (!best) {
            const toggles = frame.locator(
                '[data-path="RioSelectInputQuery.toggle-button"]:visible'
            );
            const toggleCount = await toggles.count().catch(() => 0);

            for (let i = 0; i < toggleCount; i++) {
                const candidate = toggles.nth(i);
                const box = await candidate.boundingBox().catch(() => null);
                if (!box) continue;

                const sameRow = Math.abs(box.y - inputBox.y) < 90;
                const toRight = box.x > inputBox.x + 20;
                if (sameRow && toRight) {
                    const distance = Math.abs(box.y - inputBox.y) + Math.abs(box.x - inputBox.x);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        best = candidate;
                    }
                }
            }
        }

        if (!best) {
            throw new Error('Condition operator selector could not be located.');
        }

        await best.scrollIntoViewIfNeeded();
        await best.click({ force: true });
        await this.page.waitForTimeout(500);

        // If the toggle itself did not open the menu in this AA build,
        // click its internal toggle button once more.
        const search = frame.locator(
            '[data-path="RioSelectInputQuery.search-input"]:visible'
        );
        if (await search.count().catch(() => 0) === 0) {
            const internalToggle = best.locator(
                '[data-path="RioSelectInputQuery.toggle-button"]'
            ).first();
            if (await internalToggle.count().catch(() => 0) > 0) {
                await internalToggle.click({ force: true }).catch(() => {});
                await this.page.waitForTimeout(500);
            }
        }
    }

    // ============================================================
    // ADD FIRST RULE
    // ============================================================

    async addFirstRule(): Promise<void> {
        const frame = this.getFrame();
        const addRule = await this.firstVisible([
            frame.locator('button[aria-label="Add rule"]'),
            frame.getByRole('button', { name: /Add rule/i })
        ]);
        if (!addRule) throw new Error('Add Rule button was not found.');
        await expect(addRule).toBeEnabled();
        await addRule.click({ force: true });
        await this.page.waitForTimeout(1000);

        await expect(frame.getByText('Rule1', { exact: true }).last())
            .toBeVisible({ timeout: 20_000 });

        console.log('✓ Rule1 created and visible');
    }
    async addFirstCondition(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nAdding first condition...');

        const candidates: Locator[] = [
            frame.getByRole('button', { name: 'Add condition', exact: true }),
            frame.locator('button[aria-label="Add condition"]'),
            frame.getByText('Add condition', { exact: true })
        ];

        const button = await this.firstVisible(candidates);
        if (!button) throw new Error('Add condition button was not found.');

        await button.click({ force: true });
        await this.page.waitForTimeout(700);

        await expect(
            frame.locator('input[placeholder="Select element"]:visible').first()
        ).toBeVisible({ timeout: 20_000 });

        console.log('✓ First condition added');
    }

    async configureFirstCondition(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nConfiguring first condition: Name -> Is Not Empty...');

        const elementInput = frame.locator(
            'input[placeholder="Select element"]:visible'
        ).first();
        await expect(elementInput).toBeVisible({ timeout: 20_000 });

        await elementInput.click({ force: true });
        await this.page.waitForTimeout(400);
        await this.clickRuleOption('Name');
        console.log('✓ Name selected');

        await this.clickConditionOperator(elementInput);
        console.log('✓ Condition operator selector found');

        // The UI displays this as "Is not empty" in the current build.
        // Search is case-insensitive, so both capitalization variants work.
        await this.clickRuleOption('Is not empty');
        console.log('✓ Name -> Is Not Empty configured');

        // Is Not Empty must not expose a value field.
        const valueInputs = frame.locator(
            'input[placeholder*="value" i]:visible, textarea[placeholder*="value" i]:visible'
        );
        expect(await valueInputs.count().catch(() => 0)).toBe(0);
    }

    async addSecondConditionWithAND(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nAdding second condition with AND...');

        // In some AA builds the AND/OR selector is exposed only after
        // the second condition is added. Prefer an existing AND control,
        // otherwise add the condition first and then select AND.
        const addCandidates: Locator[] = [
            frame.getByRole('button', { name: 'Add condition', exact: true }),
            frame.locator('button[aria-label="Add condition"]'),
            frame.getByText('Add condition', { exact: true })
        ];
        const addButton = await this.firstVisible(addCandidates);
        if (!addButton) throw new Error('Add condition button was not found.');

        await addButton.click({ force: true });
        await this.page.waitForTimeout(700);

        const selectors = frame.locator('input[placeholder="Select element"]:visible');
        await expect(selectors.nth(1)).toBeVisible({ timeout: 20_000 });

        // Select AND using the actual visible control, regardless of whether
        // AA renders it as a button, radio, option, or custom text control.
        const andCandidates: Locator[] = [
            frame.locator('button:visible').filter({ hasText: /^AND$/i }),
            frame.locator('[role="radio"]:visible').filter({ hasText: /^AND$/i }),
            frame.locator('[role="option"]:visible').filter({ hasText: /^AND$/i }),
            frame.locator('label:visible').filter({ hasText: /^AND$/i }),
            frame.getByText('AND', { exact: true })
        ];

        let andControl = await this.firstVisible(andCandidates);

        if (!andControl) {
            // Some builds expose a custom select toggle instead of an AND button.
            const toggles = frame.locator(
                '[data-path="RioSelectInputQuery.toggle-button"]:visible'
            );
            const count = await toggles.count().catch(() => 0);
            if (count > 0) {
                const last = toggles.last();
                await last.click({ force: true });
                await this.page.waitForTimeout(400);
                andControl = await this.firstVisible([
                    frame.getByText('AND', { exact: true }),
                    frame.locator('[role="option"]:visible').filter({ hasText: /^AND$/i }),
                    frame.locator('[role="menuitem"]:visible').filter({ hasText: /^AND$/i })
                ]);
            }
        }

        if (!andControl) {
            const text = await frame.locator('body').innerText().catch(() => '');
            throw new Error(
                'AND control could not be found. Visible Rules Builder text:\n' +
                text.slice(-8000)
            );
        }

        await andControl.click({ force: true });
        await this.page.waitForTimeout(500);

        // Configure the second condition completely here so the test's
        // single method performs the complete AND condition operation.
        await selectors.nth(1).click({ force: true });
        await this.page.waitForTimeout(400);
        await this.clickRuleOption('Status');

        await this.clickConditionOperator(selectors.nth(1));
        console.log('✓ Second condition operator selector found');
        await this.clickRuleOption('Contains');

        const valueCandidates: Locator[] = [
            frame.locator('input[placeholder*="value" i]:visible'),
            frame.locator('input[placeholder*="enter" i]:visible'),
            frame.locator('textarea:visible')
        ];
        const valueInput = await this.firstVisible(valueCandidates);
        if (valueInput) {
            await valueInput.fill('Pending');
        } else {
            // Contains requires a value. If AA renders it as a custom field,
            // locate the first visible text input belonging to the second row.
            const inputs = frame.locator('input[type="text"]:visible');
            const count = await inputs.count().catch(() => 0);
            if (count === 0) throw new Error('Contains value input was not found.');
            await inputs.last().fill('Pending');
        }

        console.log('✓ Second condition configured: AND / Status / Contains / Pending');
    }
    async configureSecondCondition(): Promise<void> {

        const frame =
            this.getFrame();

        const selectors =
            frame.locator(
                'input[placeholder="Select element"]'
            );

        const count =
            await selectors.count();

        if (count < 2) {
            throw new Error(
                `Expected two condition selectors, found ${count}.`
            );
        }

        // --------------------------------------------------------
        // SELECT STATUS
        // --------------------------------------------------------

        await selectors
            .nth(1)
            .click({
                force: true
            });

        await this.page.waitForTimeout(
            400
        );

        const statusCandidates: Locator[] = [

            frame.getByText(
                'Status',
                {
                    exact: true
                }
            ),

            frame.locator(
                '[role="option"]'
            ).filter({
                hasText: 'Status'
            }),

            frame.locator(
                '[role="menuitem"]'
            ).filter({
                hasText: 'Status'
            })
        ];

        let statusOption: Locator | null = null;

        for (
            const candidate
            of statusCandidates
        ) {

            const candidateCount =
                await candidate
                    .count()
                    .catch(
                        () => 0
                    );

            for (
                let i = 0;
                i < candidateCount;
                i++
            ) {

                const item =
                    candidate.nth(i);

                if (
                    await item
                        .isVisible()
                        .catch(
                            () => false
                        )
                ) {

                    statusOption = item;

                    break;
                }
            }

            if (statusOption) {
                break;
            }
        }

        if (!statusOption) {
            throw new Error(
                'Status option was not found.'
            );
        }

        await statusOption.click({
            force: true
        });

        await this.page.waitForTimeout(
            400
        );

        console.log(
            '✓ Status selected'
        );

        // --------------------------------------------------------
        // SELECT CONTAINS
        // --------------------------------------------------------

        const operatorButtons =
            frame.locator(
                '[role="combobox"]'
            );

        const comboCount =
            await operatorButtons.count();

        let visibleCombos: Locator[] = [];

        for (
            let i = 0;
            i < comboCount;
            i++
        ) {

            const combo =
                operatorButtons.nth(i);

            if (
                await combo
                    .isVisible()
                    .catch(
                        () => false
                    )
            ) {

                visibleCombos.push(
                    combo
                );
            }
        }

        if (
            visibleCombos.length === 0
        ) {

            throw new Error(
                'Second condition operator selector was not found.'
            );
        }

        await visibleCombos[
            visibleCombos.length - 1
        ].click({
            force: true
        });

        await this.page.waitForTimeout(
            400
        );

        const containsCandidates: Locator[] = [

            frame.getByText(
                'Contains',
                {
                    exact: true
                }
            ),

            frame.locator(
                '[role="option"]'
            ).filter({
                hasText: /^Contains$/i
            }),

            frame.locator(
                '[role="menuitem"]'
            ).filter({
                hasText: /^Contains$/i
            })
        ];

        let containsOption: Locator | null = null;

        for (
            const candidate
            of containsCandidates
        ) {

            const candidateCount =
                await candidate
                    .count()
                    .catch(
                        () => 0
                    );

            for (
                let i = 0;
                i < candidateCount;
                i++
            ) {

                const item =
                    candidate.nth(i);

                if (
                    await item
                        .isVisible()
                        .catch(
                            () => false
                        )
                ) {

                    containsOption = item;

                    break;
                }
            }

            if (containsOption) {
                break;
            }
        }

        if (!containsOption) {
            throw new Error(
                'Contains option was not found.'
            );
        }

        await containsOption.click({
            force: true
        });

        await this.page.waitForTimeout(
            400
        );

        console.log(
            '✓ Contains selected'
        );

        // --------------------------------------------------------
        // VALUE
        // --------------------------------------------------------

        const valueCandidates: Locator[] = [

            frame.locator(
                'input[placeholder*="value" i]'
            ),

            frame.locator(
                'input[placeholder*="enter" i]'
            )
        ];

        let valueInput: Locator | null = null;

        for (
            const candidate
            of valueCandidates
        ) {

            const candidateCount =
                await candidate
                    .count()
                    .catch(
                        () => 0
                    );

            for (
                let i = 0;
                i < candidateCount;
                i++
            ) {

                const item =
                    candidate.nth(i);

                if (
                    await item
                        .isVisible()
                        .catch(
                            () => false
                        )
                ) {

                    valueInput = item;

                    break;
                }
            }

            if (valueInput) {
                break;
            }
        }

        if (valueInput) {

            await valueInput.fill(
                'Pending'
            );

            console.log(
                '✓ Value: Pending'
            );

        } else {

            console.log(
                'No separate condition value field exposed.'
            );
        }

        console.log(
            '✓ Second condition configured'
        );
    }

    // ============================================================
    // ADD SET VALUE ACTION
    // ============================================================

    async addSetValueAction(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nAdding Set Value action...');

        const addAction = await this.firstVisible([
            frame.getByRole('button', { name: 'Add action', exact: true }),
            frame.locator('button[aria-label="Add action"]'),
            frame.getByText('Add action', { exact: true })
        ]);
        if (!addAction) throw new Error('Add action button was not found.');
        await addAction.click({ force: true });
        await this.page.waitForTimeout(500);

        const setValue = await this.firstVisible([
            frame.locator('[role="option"]:visible').filter({ hasText: /^Set Value$/i }),
            frame.locator('[role="menuitem"]:visible').filter({ hasText: /^Set Value$/i }),
            frame.getByText('Set Value', { exact: true })
        ]);
        if (!setValue) throw new Error('Set Value action option was not found.');
        await setValue.click({ force: true });
        await this.page.waitForTimeout(700);

        // Assign the action to the other textbox: Status.
        const targetSelectors = frame.locator('input[placeholder="Select element"]:visible');
        const targetCount = await targetSelectors.count().catch(() => 0);
        if (targetCount > 0) {
            await targetSelectors.last().click({ force: true });
            await this.page.waitForTimeout(300);
            await this.clickRuleOption('Status');
        }

        // Set Value action value, if exposed as a text field.
        const valueInputs = frame.locator(
            'input[placeholder*="value" i]:visible, textarea[placeholder*="value" i]:visible'
        );
        const valueCount = await valueInputs.count().catch(() => 0);
        if (valueCount > 0) {
            await valueInputs.last().fill('Approved');
        }

        // Verify action text/target is present in the rendered rule card.
        const body = await frame.locator('body').innerText().catch(() => '');
        expect(body).toMatch(/Set Value/i);
        expect(body).toMatch(/Status/i);
        console.log('✓ Set Value action assigned to Status');
    }
    async addRuleBelow(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nAdding Rule Below...');

        // Find the last visible rule card. Prefer an ancestor containing Edit.
        const ruleTexts = frame.locator('text=/^Rule\d+$/');
        const ruleCount = await ruleTexts.count().catch(() => 0);
        let card: Locator | null = null;

        if (ruleCount > 0) {
            const lastRule = ruleTexts.last();
            const ancestors = [
                lastRule.locator('xpath=ancestor::*[.//button[contains(normalize-space(.),"Edit")]][1]'),
                lastRule.locator('xpath=ancestor::*[.//*[normalize-space(text())="Edit"]][1]'),
                lastRule.locator('xpath=ancestor::div[1]')
            ];
            card = await this.firstVisible(ancestors);
        }

        // Context-menu button candidates inside the last rule card first.
        const scope = card ?? frame;
        const menu = await this.firstVisible([
            scope.locator('button[aria-label*="More" i]:visible'),
            scope.locator('button[aria-label*="menu" i]:visible'),
            scope.locator('button[aria-label*="action" i]:visible'),
            scope.locator('button[name*="More" i]:visible'),
            scope.locator('[title*="More" i]:visible'),
            scope.locator('[title*="Action" i]:visible'),
            scope.locator('[aria-haspopup="menu"]:visible'),
            scope.locator('[data-path*="menu" i]:visible'),
            scope.getByRole('button', { name: /More|Actions|menu/i })
        ]);

        if (!menu) {
            throw new Error('Rule context menu button was not found.');
        }

        await menu.click({ force: true });
        await this.page.waitForTimeout(400);

        const addBelow = await this.firstVisible([
            frame.locator('[role="menuitem"]:visible').filter({ hasText: /Add Rule Below/i }),
            frame.locator('button:visible').filter({ hasText: /Add Rule Below/i }),
            frame.getByText(/Add Rule Below/i)
        ]);

        if (!addBelow) {
            const body = await frame.locator('body').innerText().catch(() => '');
            throw new Error('Add Rule Below option was not found.\n' + body.slice(-6000));
        }

        await addBelow.click({ force: true });
        await this.page.waitForTimeout(800);

        console.log('✓ Add Rule Below completed');
    }
    async verifyRules(expectedRules: string[]): Promise<void> {
        const frame = this.getFrame();
        console.log('\nVerifying Rules Builder...');

        const bodyText = await frame.locator('body').innerText().catch(() => '');
        for (const rule of expectedRules) {
            expect(bodyText).toContain(rule);
            console.log(`✓ ${rule} is visible`);
        }

        // Every rule must have an Edit control. Count visible edit controls
        // and require at least one for every expected rule.
        const editControls = frame.locator(
            'button:visible, [role="button"]:visible'
        ).filter({ hasText: /^Edit$/i });
        const editCount = await editControls.count().catch(() => 0);

        const editByLabel = frame.locator(
            'button[aria-label*="Edit" i]:visible, [role="button"][aria-label*="Edit" i]:visible'
        );
        const labelledEditCount = await editByLabel.count().catch(() => 0);
        const totalEditCount = Math.max(editCount, labelledEditCount);
        expect(totalEditCount).toBeGreaterThanOrEqual(expectedRules.length);
        console.log(`✓ ${totalEditCount} Edit controls found`);

        // Rule1 should remain expanded after creation.
        const rule1 = frame.getByText('Rule1', { exact: true }).last();
        await expect(rule1).toBeVisible({ timeout: 10_000 });

        console.log('✓ All rules are listed and Edit controls are present');
    }
    async saveForm(): Promise<void> {
        const frame = this.getFrame();
        console.log('\nSaving Form...');

        const saveButton = await this.firstVisible([
            frame.getByRole('button', { name: 'save', exact: true }),
            frame.locator('button[aria-label="save"]'),
            frame.getByRole('button', { name: 'Save', exact: true }),
            frame.getByText('Save', { exact: true })
        ]);

        if (!saveButton) {
            throw new Error('Save button was not found.');
        }

        await saveButton.click({ force: true });
        await this.page.waitForTimeout(3_000);
        console.log('✓ Form saved');

        // Verify persistence by reopening the saved form builder state.
        try {
            await this.page.reload({
                waitUntil: 'domcontentloaded',
                timeout: 60_000
            });
        } catch {
            // AA can keep the SPA loading after a successful save.
            console.log('Reload timed out; waiting for SPA to recover...');
        }

        await this.page.waitForTimeout(3_000);
        await this.findFormBuilderFrame();
        await this.openRulesBuilder();

        const persistedFrame = this.getFrame();
        const persistedText = await persistedFrame.locator('body').innerText();

        for (const rule of ['Rule1', 'Rule2', 'Rule3']) {
            expect(persistedText).toContain(rule);
        }

        console.log('✓ Rule1 persisted after save');
        console.log('✓ Rule2 persisted after save');
        console.log('✓ Rule3 persisted after save');
        console.log('✓ All rules persisted successfully');
    }

}