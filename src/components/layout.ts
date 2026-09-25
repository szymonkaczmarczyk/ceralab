
export const PRIVACY_URL = '/polityka-prywatnosci/';

export function renderCritical(): string {
  return `<style>
      html{background:#F5F1EB;color:#1C1A17}
      body{margin:0}
      a{color:inherit}
      svg{flex-shrink:0}
      .js .preloader{position:fixed;inset:0;z-index:300;display:grid;place-items:center;align-content:center;gap:1.5rem;background:#F5F1EB}
      html.js:not(.is-ready) .nav,html.js:not(.is-ready) main{visibility:hidden}
      @media (prefers-reduced-motion:no-preference){.js .preloader-mark path,.js .nf-mark path{stroke-dasharray:1;stroke-dashoffset:1}}
    </style>
    <script>setTimeout(function(){document.documentElement.classList.add('is-ready')},4000)</script>`;
}

export function renderSprite(): string {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
      <symbol id="logo-mark" viewBox="0 0 100 100">
        <path d="M89.7 28.9A45 45 0 1 0 89.7 71.1" fill="none" stroke="currentColor" stroke-width="5.5" />
        <path d="M75.7 34.6A30 30 0 1 0 75.7 65.4" fill="none" stroke="currentColor" stroke-width="5.5" />
      </symbol>
      <symbol id="icon-arrow" viewBox="0 0 24 24">
        <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </symbol>
    </svg>`;
}

export function renderNav(page: 'home' | 'sub'): string {
  const base = page === 'home' ? '' : '/';
  return `<header class="nav" id="nav">
      <div class="nav-bar">
        <a class="nav-logo" href="${page === 'home' ? '#hero' : '/'}" aria-label="CeraLab — strona główna">
          <svg class="nav-logo-mark" width="30" height="30" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo-mark" /></svg>
          <span class="nav-logo-word">CeraLab</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">
          <span class="nav-toggle-label">Menu</span>
        </button>
        <nav class="nav-menu" id="nav-menu" aria-label="Główna">
          <ul class="nav-links">
            <li><a href="${base}#products">Produkty</a></li>
            <li><a href="${base}#process">Proces</a></li>
            <li><a href="${base}#contact">Kontakt</a></li>
          </ul>
          <a class="btn nav-cta" href="${base}#products">Kup teraz</a>
        </nav>
      </div>
    </header>`;
}

export function renderFooter(): string {
  return `<footer class="site-footer">
      <p>© CeraLab 2026</p>
      <a href="${PRIVACY_URL}">Polityka prywatności</a>
    </footer>`;
}

export function renderCursor(): string {
  return `<div class="cursor" aria-hidden="true"><span class="cursor-ring"></span></div>`;
}
