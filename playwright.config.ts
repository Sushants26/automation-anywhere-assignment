import {
    defineConfig,
    devices,
} from '@playwright/test';

import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

    testDir: './tests',

    fullyParallel: false,

    timeout: 120_000,

    expect: {
        timeout: 15_000,
    },

    reporter: [
        [
            'html',
            {
                open: 'never',
            },
        ],
        ['list'],
    ],

    use: {

        baseURL:
            process.env.AA_BASE_URL ||
            'https://community.cloud.automationanywhere.digital',

        headless: false,

        /*
         * IMPORTANT
         */
        storageState:
            'auth/auth-state.json',

        screenshot:
            'only-on-failure',

        video:
            'retain-on-failure',

        trace:
            'retain-on-failure',

        actionTimeout:
            20_000,

        navigationTimeout:
            60_000,
    },

    projects: [
        {
            name: 'chromium',

            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});