import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  pin: '(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',
  noPin: '(max-width: 899px), (max-height: 719px)',
  fine: '(pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const;

export const reducedMotion = () => window.matchMedia(MQ.reduce).matches;

export const mm = gsap.matchMedia();

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (reducedMotion()) return null;
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  return lenis;
}

export const getLenis = () => lenis;

export const anchorOverrides = new Map<string, () => number>();

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

export function scrollToElement(el: HTMLElement) {
  const override = anchorOverrides.get(el.id);
  if (override) return scrollToY(override());

  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: 'auto' });
}

export function splitWords(el: Element) {
  return SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'sw', aria: 'auto' });
}
