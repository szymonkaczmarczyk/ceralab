
import { products, type Product } from '../data/products.ts';
import { processSteps } from '../data/process.ts';
import { policyMeta, policySections, policySummary } from '../data/legal.ts';

const pad = (n: number) => String(n).padStart(2, '0');
const total = pad(products.length);

function picture(p: Product, sizes: string, loading: 'lazy' | 'eager' = 'lazy') {
  const set = (ext: string) =>
    `/images/products/${p.image}-720.${ext} 720w, /images/products/${p.image}-1200.${ext} 1200w`;
  return `<picture>
      <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
      <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
      <img src="/images/products/${p.image}-720.webp" alt="${p.imageAlt}" width="720" height="720" loading="${loading}" decoding="async">
    </picture>`;
}

const zoomStyle = (p: Product) => (p.imageZoom ? ` style="--img-zoom: ${p.imageZoom}"` : '');

export function renderArches(): string {
  return products
    .map(
      (p, i) => `<li class="arch" data-index="${i}"${zoomStyle(p)}>
    <a class="arch-link" href="#product-${p.id}" data-product-link="${i}">
      <span class="arch-frame">${picture(p, '(min-width: 768px) 30vw, 80vw')}</span>
      <span class="arch-caption">
        <span class="arch-step">${pad(i + 1)} · ${p.step}</span>
        <span class="arch-name">${p.name}</span>
      </span>
    </a>
  </li>`,
    )
    .join('\n');
}

export function renderProgress(): string {
  return products
    .map(
      (p, i) =>
        `<li><button type="button" class="progress-dot${i === 0 ? ' is-active' : ''}" data-goto="${i}" aria-label="Pokaż produkt ${i + 1}: ${p.name}"><span class="progress-num">${pad(i + 1)}</span><span class="progress-label">${p.step}</span></button></li>`,
    )
    .join('\n');
}

export function renderProducts(): string {
  return products
    .map(
      (p, i) => `<article class="product" id="product-${p.id}" data-product="${i}" style="--product-color: ${p.colorVar};${p.imageZoom ? ` --img-zoom: ${p.imageZoom};` : ''}" aria-labelledby="product-${p.id}-name">
    <div class="product-media">
      <div class="product-arch">${picture(p, '(min-width: 900px) 40vw, 90vw')}</div>
    </div>
    <div class="product-body">
      <p class="product-index" data-reveal><span class="product-num">${pad(i + 1)}</span> / ${total} · ${p.step}</p>
      <p class="product-category eyebrow" data-reveal>${p.category}</p>
      <h3 class="product-name" id="product-${p.id}-name" data-split>${p.name}</h3>
      <p class="product-tagline" data-reveal>${p.tagline}</p>
      <p class="product-desc" data-reveal>${p.description}</p>
      <div class="product-cols" data-reveal>
        <div class="product-col">
          <h4 class="product-col-title">Skład</h4>
          <ul class="ingredients">
            ${p.ingredients.map((ing) => `<li><strong>${ing.name}</strong><span>${ing.role}</span></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="product-col">
          <h4 class="product-col-title">Właściwości</h4>
          <dl class="props">
            <div><dt>Pojemność</dt><dd>${p.volume}</dd></div>
            ${p.properties.map((pr) => `<div><dt>${pr.label}</dt><dd>${pr.value}</dd></div>`).join('\n            ')}
          </dl>
        </div>
      </div>
      <div class="product-foot" data-reveal>
        <span class="product-price">${p.price}</span>
        <a class="btn btn--dark" href="#" data-magnetic>Poznaj produkt</a>
      </div>
    </div>
  </article>`,
    )
    .join('\n');
}

export function renderProcess(): string {
  return processSteps
    .map(
      (s, i) => `<li class="step">
    <span class="step-line" aria-hidden="true"></span>
    <span class="step-num">${pad(i + 1)}</span>
    <div class="step-text">
      <h3 class="step-title">${s.title}</h3>
      <p class="step-lead">${s.lead}</p>
      <p class="step-body">${s.body}</p>
    </div>
  </li>`,
    )
    .join('\n');
}

export function renderPolicySummary(): string {
  return policySummary
    .map(
      (s, i) => `<li class="summary-card">
    <span class="summary-num">${pad(i + 1)}</span>
    <h3 class="summary-title">${s.title}</h3>
    <p>${s.text}</p>
  </li>`,
    )
    .join('\n');
}

export function renderPolicyToc(): string {
  return policySections
    .map(
      (s, i) =>
        `<li><a class="toc-link" href="#${s.id}" data-toc="${s.id}"><span class="toc-num">${pad(i + 1)}</span><span class="toc-label">${s.title}</span></a></li>`,
    )
    .join('\n');
}

export function renderPolicy(): string {
  return policySections
    .map(
      (s, i) => `<section class="policy-section" id="${s.id}" aria-labelledby="${s.id}-title">
    <p class="policy-num" aria-hidden="true">${pad(i + 1)}</p>
    <h2 class="policy-heading" id="${s.id}-title">${s.title}</h2>
    <div class="policy-body">${s.html}</div>
  </section>`,
    )
    .join('\n');
}

export function renderPolicyMeta(): string {
  return `Ostatnia aktualizacja: ${policyMeta.updated} · Obowiązuje od: ${policyMeta.effectiveDate}`;
}

export function renderMiniArches(): string {
  return products
    .map(
      (p) => `<li class="nf-arch"${zoomStyle(p)}>
    <span class="nf-arch-frame"><img src="/images/products/${p.image}-720.webp" alt="" width="720" height="720" decoding="async"></span>
  </li>`,
    )
    .join('\n');
}

