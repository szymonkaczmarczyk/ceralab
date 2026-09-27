import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const PORT = 4317;
const BASE_URL = `http://localhost:${PORT}`;
const e2eOutDir = join(tmpdir(), 'ceralab-e2e-dist');
const defaultMacChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromiumPath = process.env.PW_CHROMIUM_PATH ?? (existsSync(defaultMacChrome) ? defaultMacChrome : undefined);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx vite build --outDir "${e2eOutDir}" --emptyOutDir && npx vite preview --outDir "${e2eOutDir}" --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
