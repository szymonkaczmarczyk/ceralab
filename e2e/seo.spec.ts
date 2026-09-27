import { expect, test } from '@playwright/test';

const INDEXED = [
  { path: '/', canonical: 'https://ceralab.pl/', hasJsonLd: true },
  { path: '/polityka-prywatnosci/', canonical: 'https://ceralab.pl/polityka-prywatnosci/', hasJsonLd: false },
];

for (const { path, canonical, hasJsonLd } of INDEXED) {
  test(`meta SEO na ${path}`, async ({ page }) => {
    await page.goto(path);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(60);

    const meta = (selector: string) => page.locator(selector).getAttribute('content');
    const description = await meta('meta[name="description"]');
    expect(description?.length ?? 0).toBeGreaterThan(50);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index/);
    expect(await meta('meta[property="og:title"]')).toBe(title);
    expect(await meta('meta[property="og:description"]')).toBe(description);
    expect(await meta('meta[property="og:url"]')).toBe(canonical);
    expect(await meta('meta[property="og:image"]')).toMatch(/^https:\/\//);
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');

    await expect(page.locator('title')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);

    const jsonLd = page.locator('script[type="application/ld+json"]');
    if (hasJsonLd) {
      const data = JSON.parse((await jsonLd.textContent()) ?? '{}');
      expect(data['@type']).toBe('Organization');
      expect(data.url).toBe('https://ceralab.pl');
    } else {
      await expect(jsonLd).toHaveCount(0);
    }
  });
}

test('strona 404 ma noindex i nie ma canonical', async ({ page }) => {
  await page.goto('/nie-ma-mnie');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('og:image istnieje i jest obrazem', async ({ page, request }) => {
  await page.goto('/');
  const image = await page.locator('meta[property="og:image"]').getAttribute('content');
  const response = await request.get(new URL(image!).pathname);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
});

test('robots.txt wskazuje sitemapę', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Sitemap: https://ceralab.pl/sitemap.xml');
});

test('każdy adres z sitemap.xml odpowiada 200', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const locs = [...(await response.text()).matchAll(/<loc>(.+?)<\/loc>/g)].map((match) => match[1]);
  expect(locs.length).toBeGreaterThanOrEqual(2);
  for (const loc of locs) {
    const page = await request.get(new URL(loc).pathname);
    expect(page.status(), loc).toBe(200);
  }
});
