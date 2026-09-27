import { expect, test } from '@playwright/test';
import { expectScrolledTo, PAGES, waitForReady } from './helpers';

test.describe('nawigacja desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'menu desktopowe');

  for (const [label, id] of [['Proces', 'process'], ['Kontakt', 'contact']] as const) {
    test(`link „${label}” przewija do sekcji i przenosi fokus`, async ({ page }) => {
      await page.goto('/');
      await waitForReady(page);
      await page.locator('.nav-links').getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expectScrolledTo(page, id);
      await expect(page.locator(`#${id}`)).toBeFocused();
    });
  }

  for (const id of ['products', 'process', 'contact']) {
    test(`po przejściu do #${id} podświetlony jest tylko jego link`, async ({ page }) => {
      await page.goto('/');
      await waitForReady(page);
      await page.locator(`.nav-links a[href="#${id}"]`).click();
      await expectScrolledTo(page, id);
      await page.waitForTimeout(1_600);
      await expect(page.locator(`.nav-links a[href="#${id}"]`)).toHaveClass(/is-active/);
      await expect(page.locator('.nav-links a.is-active')).toHaveCount(1);
    });
  }

  test('na niskim ekranie nawigacja ciemnieje, gdy dojedzie do kontaktu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 600 });
    await page.goto('/');
    await waitForReady(page);
    const nav = page.locator('#nav');
    await page.locator('.nav-links a[href="#process"]').click();
    await expectScrolledTo(page, 'process');
    await page.waitForTimeout(1_600);
    await expect(nav).not.toHaveClass(/is-on-dark/);
    const contactLink = page.locator('.nav-links a[href="#contact"]');
    await contactLink.focus();
    await expect(contactLink).toBeInViewport();
    await page.keyboard.press('Enter');
    await expectScrolledTo(page, 'contact');
    await expect(nav).toHaveClass(/is-on-dark/);
  });

  test('ciemny wariant nawigacji zgadza się z sekcją pod nią', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1_800);
    const contactUnderNav = await page.locator('#contact').evaluate((el) => el.getBoundingClientRect().top <= 48);
    if (contactUnderNav) await expect(page.locator('#nav')).toHaveClass(/is-on-dark/);
    else await expect(page.locator('#nav')).not.toHaveClass(/is-on-dark/);
  });
});

test.describe('menu mobilne', () => {
  test.skip(({ isMobile }) => !isMobile, 'tylko telefon');

  test('otwiera się, zamyka Escape i oddaje fokus', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    const toggle = page.locator('.nav-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.nav-links').getByRole('link', { name: 'Produkty' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('kliknięcie linku zamyka menu i przewija do sekcji', async ({ page }) => {
    await page.goto('/');
    await waitForReady(page);
    await page.locator('.nav-toggle').click();
    await page.locator('.nav-links').getByRole('link', { name: 'Kontakt' }).click();
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false');
    await expectScrolledTo(page, 'contact');
  });
});

test('skip link przenosi fokus do treści', async ({ page, isMobile }) => {
  test.skip(isMobile, 'klawiatura - desktop');
  await page.goto('/');
  await waitForReady(page);
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('wejście z adresu /#contact przewija do kontaktu', async ({ page }) => {
  await page.goto('/#contact');
  await waitForReady(page);
  await expectScrolledTo(page, 'contact');
});

test('link „Produkty” z polityki prowadzi do sekcji na stronie głównej', async ({ page, isMobile }) => {
  await page.goto('/polityka-prywatnosci/');
  await waitForReady(page);
  if (isMobile) await page.locator('.nav-toggle').click();
  await page.locator('.nav-links').getByRole('link', { name: 'Produkty' }).click();
  await expect(page).toHaveURL(/\/#products$/);
  await waitForReady(page);
  await expectScrolledTo(page, 'products');
});

for (const { name, path } of PAGES) {
  test(`${name}: wewnętrzne linki nie prowadzą do 404`, async ({ page, request }) => {
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    const internal = [...new Set(hrefs.filter((href) => href.startsWith('/')).map((href) => href.split('#')[0] || '/'))];
    for (const href of internal) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
    const anchors = hrefs.filter((href) => href.startsWith('#') && href.length > 1).map((href) => href.slice(1));
    for (const id of new Set(anchors)) {
      await expect(page.locator(`[id="${id}"]`), `kotwica #${id}`).toHaveCount(1);
    }
    const placeholders = hrefs.filter((href) => href === '#').length;
    if (placeholders) test.info().annotations.push({ type: 'zaślepki', description: `${placeholders} linków z href="#"` });
  });
}
