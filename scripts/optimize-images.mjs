
import sharp from 'sharp';
import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const PRODUCTS = ['cleanser', 'serum', 'cream'];
const WIDTHS = [720, 1200];

await mkdir('public/images/products', { recursive: true });
await mkdir('public/videos', { recursive: true });

for (const name of PRODUCTS) {
  const src = `images/products/${name}.jpg`;
  for (const w of WIDTHS) {
    const base = sharp(src).resize(w, w);
    await base.clone().webp({ quality: 80 }).toFile(`public/images/products/${name}-${w}.webp`);
    await base.clone().avif({ quality: 55 }).toFile(`public/images/products/${name}-${w}.avif`);
  }
  console.log('✓', name);
}

if (existsSync('images/hero-poster.jpg')) {
  for (const w of [960, 1920]) {
    await sharp('images/hero-poster.jpg').resize(w).webp({ quality: 72 }).toFile(`public/images/hero-poster-${w}.webp`);
  }
  console.log('✓ hero-poster');
}

await copyFile('videos/background-intro.mp4', 'public/videos/background-intro.mp4');
console.log('✓ video');

