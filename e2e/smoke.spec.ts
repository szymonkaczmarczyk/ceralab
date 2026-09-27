import { expect, test } from '@playwright/test';
import { PAGES, trackProblems, waitForReady } from './helpers';

for (const { name, path, status } of PAGES) {
  test.describe(name, () => {
    test('ładuje się z poprawnym statusem, jednym h1 i bez błędów', async ({ page }) => {
      const problems = trackProblems(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(status);
      await waitForReady(page);

      await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.locator('#nav')).toBeVisible();
      await expect(page.locator('.site-footer')).toBeVisible();

      await page.mouse.wheel(0, 20_000);
      await page.waitForTimeout(800);
      expect(problems, problems.join('\n')).toEqual([]);
    });

    test('nie ma poziomego scrolla', async ({ page }) => {
      await page.goto(path);
      await waitForReady(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('jest czytelna z wyłączonym JavaScriptem', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.locator('#preloader')).toBeHidden();
      await context.close();
    });
  });
}

test.describe('szerokości ekranu', () => {
  test.skip(({ isMobile }) => isMobile, 'zestaw szerokości sprawdzamy raz, w projekcie desktop');

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`strona główna bez poziomego scrolla przy ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await waitForReady(page);
      for (const y of [0, 1500, 4000, 8000, 20_000]) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `przewinięcie do ${y}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test('bez JS wszystkie 3 produkty są widoczne', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const names = page.locator('.product-name');
  await expect(names).toHaveCount(3);
  for (const name of await names.all()) await expect(name).toBeVisible();
  await context.close();
});
