import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  use: {
    headless: true,
    viewport: { width: 1366, height: 768 },
    screenshot: 'on',
    trace: 'on',
    baseURL: 'https://jwt.io/',
  },
  reporter: [
    ['html', { outputFolder: 'reports', open: 'never' }],
    ['list']
  ],
});
