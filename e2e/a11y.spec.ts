import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { PAGES, waitForReady } from './helpers';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

function describeViolations(violations: AxeResults['violations']) {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => `    ${node.target.join(' ')}\n      ${node.failureSummary?.split('\n').slice(1).join(' ')}`);
      return `[${violation.impact}] ${violation.id} - ${violation.help}\n${targets.join('\n')}`;
    })
    .join('\n\n');
}

async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const bestPractice = await new AxeBuilder({ page }).withTags(['best-practice']).analyze();
  if (bestPractice.violations.length) {
    test.info().annotations.push({
      type: 'axe best-practice',
      description: bestPractice.violations.map((v) => `${v.id} (${v.nodes.length})`).join(', '),
    });
  }
  return results.violations;
}

test.describe('axe WCAG 2.2 AA', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const { name, path } of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path);
      await waitForReady(page);
      const violations = await scan(page);
      expect(violations, describeViolations(violations)).toEqual([]);
    });
  }

  test('otwarte menu mobilne', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'tylko telefon');
    await page.goto('/');
    await waitForReady(page);
    await page.locator('.nav-toggle').click();
    const violations = await scan(page);
    expect(violations, describeViolations(violations)).toEqual([]);
  });
});

test.describe('axe z animacjami', () => {
  for (const { name, path } of PAGES) {
    test(`${name} po zakończeniu intro`, async ({ page }) => {
      await page.goto(path);
      await waitForReady(page);
      await page.waitForTimeout(2_500);
      const violations = await scan(page);
      expect(violations, describeViolations(violations)).toEqual([]);
    });
  }
});
