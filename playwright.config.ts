import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/specs',
  retries: 0,
  reporter: [['html', { outputFolder: 'tests/report' }]],
  use: {
    baseURL: 'https://www.wangdanatest.top',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
