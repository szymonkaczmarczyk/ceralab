import { expect, test } from '@playwright/test';
import { expectScrolledTo, isPinnedLayout, nextFrames, waitForReady } from './helpers';

test('przycisk wideo pauzuje i wznawia film', async ({ page }) => {
  await page.goto('/');
  await waitForReady(page);
  const toggle = page.locator('.video-toggle');
  const paused = () => page.locator('.hero-video').evaluate((video: HTMLVideoElement) => video.paused);

  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Odtwórz wideo w tle');
  expect(await paused()).toBe(true);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Wstrzymaj wideo w tle');
});

test.describe('prefers-reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('wideo startuje zatrzymane, a wszystkie 3 produkty są widoczne', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    await expect(page.locator('.video-toggle')).toHaveAttribute('aria-pressed', 'true');
    expect(await page.locator('.hero-video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
    await expect(page.locator('[data-showcase]')).not.toHaveClass(/is-pinned/);

    for (const product of await page.locator('.product').all()) {
      await product.scrollIntoViewIfNeeded();
      await expect(product.locator('.product-name')).toBeVisible();
      await expect(product.locator('.product-price')).toBeVisible();
      expect(await product.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
    }
  });

  test('brak własnego kursora', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    await page.mouse.move(400, 400);
    await expect(page.locator('.cursor')).toBeHidden();
  });
});

test.describe('showcase produktów', () => {
  test('przypięcie tylko na dużym ekranie', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    const pinned = page.locator('[data-showcase]');
    if (isPinnedLayout(page)) await expect(pinned).toHaveClass(/is-pinned/);
    else await expect(pinned).not.toHaveClass(/is-pinned/);
  });

  test('klawiatura przełącza wszystkie 3 produkty', async ({ page }) => {
    test.skip(!isPinnedLayout(page), 'nawigacja 01/02/03 jest tylko w wersji przypiętej');
    await page.goto('/#products');
    await waitForReady(page);
    const dots = page.locator('.progress-dot');
    await expect(dots).toHaveCount(3);

    for (const index of [2, 1, 0]) {
      await dots.nth(index).focus();
      await page.keyboard.press('Enter');
      await expect(dots.nth(index)).toHaveClass(/is-active/, { timeout: 6_000 });
      await expect(dots.nth(index)).toHaveAttribute('aria-current', 'step');
      await expect
        .poll(() => page.locator('.product').nth(index).evaluate((el) => getComputedStyle(el).visibility))
        .toBe('visible');
    }
  });

  test('kliknięcie łuku przewija do produktu', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    await page.locator('.arch-link').nth(2).scrollIntoViewIfNeeded();
    await page.locator('.arch-link').nth(2).click();
    if (isPinnedLayout(page)) {
      await expect(page.locator('.progress-dot').nth(2)).toHaveClass(/is-active/, { timeout: 6_000 });
    } else {
      await expect
        .poll(() => page.locator('#product-cream').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
        .toBeLessThan(200);
    }
  });
});

test('strona 404 prowadzi z powrotem na stronę główną', async ({ page }) => {
  await page.goto('/zly-adres');
  await waitForReady(page);
  await page.getByRole('link', { name: 'Strona główna', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#hero')).toBeVisible();
});

test('spis treści polityki przewija do sekcji (klawiatura)', async ({ page, isMobile }) => {
  await page.goto('/polityka-prywatnosci/');
  await waitForReady(page);
  const details = page.locator('.toc-details');
  if ((await details.count()) > 0) {
    const open = await details.evaluate((el: HTMLDetailsElement) => el.open);
    expect(open).toBe(!isMobile);
    if (!open) await details.locator('summary').click();
  }
  const link = page.locator('.toc-link').nth(3);
  const id = (await link.getAttribute('data-toc'))!;
  await expect(link).toBeVisible();
  await link.focus();
  await expect(link).toBeFocused();
  await nextFrames(page);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expectScrolledTo(page, id);
  await expect(page.locator(`#${id}`)).toBeFocused();
});
