import { expect, type Page } from '@playwright/test';

export const PAGES = [
  { name: 'strona główna', path: '/', status: 200 },
  { name: 'polityka prywatności', path: '/polityka-prywatnosci/', status: 200 },
  { name: 'strona 404', path: '/ta-strona-nie-istnieje', status: 404 },
] as const;

export async function waitForReady(page: Page) {
  await page.waitForFunction(() => document.documentElement.classList.contains('is-ready'));
  const preloader = page.locator('#preloader');
  if ((await preloader.count()) > 0) {
    await page.waitForFunction(() => document.querySelector('#preloader')?.classList.contains('is-done'), undefined, {
      timeout: 10_000,
    });
  }
}

export function trackProblems(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`błąd JS: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    if (message.text().startsWith('Failed to load resource')) return;
    problems.push(`konsola: ${message.text()}`);
  });
  page.on('response', (response) => {
    const isDocument = response.request().resourceType() === 'document';
    if (!isDocument && response.status() >= 400) problems.push(`zasób ${response.status()}: ${response.url()}`);
  });
  return problems;
}

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900;

export const isPinnedLayout = (page: Page) => {
  const size = page.viewportSize();
  return !!size && size.width >= 900 && size.height >= 720;
};

export async function expectScrolledTo(page: Page, id: string) {
  await expect
    .poll(
      () =>
        page.evaluate((targetId) => {
          const top = document.getElementById(targetId)!.getBoundingClientRect().top;
          const atPageEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
          const nearTop = top < 160 && top > -40;
          return nearTop || (atPageEnd && top >= 0 && top < window.innerHeight / 2);
        }, id),
      { timeout: 6_000, message: `sekcja #${id} powinna być u góry ekranu albo strona przewinięta do końca` },
    )
    .toBe(true);
}

export const nextFrames = (page: Page) =>
  page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
