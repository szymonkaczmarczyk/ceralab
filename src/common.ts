
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections/global.css';

import { initSmoothScroll, ScrollTrigger } from './animations/setup';
import { initNav } from './animations/nav';
import { initCursor } from './animations/cursor';

export const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);

export function markReady() {
  document.documentElement.classList.add('is-ready');
}

export function bootCommon() {
  const lenis = initSmoothScroll();
  initNav();
  initCursor();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  return lenis;
}
