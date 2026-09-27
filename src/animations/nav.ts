import { gsap, mm, MQ, ScrollTrigger, scrollToElement } from './setup';

const SECTIONS_AFTER_PINS = -1;

export function initNav() {
  const nav = document.querySelector<HTMLElement>('#nav');
  if (!nav) return;
  const bar = nav.querySelector<HTMLElement>('.nav-bar');
  const toggle = nav.querySelector<HTMLButtonElement>('.nav-toggle');

  const setOpen = (open: boolean) => {
    nav.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };
  toggle?.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle?.focus();
    }
  });

  document.addEventListener('click', (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || e.defaultPrevented) return;
    const id = link.getAttribute('href')!.slice(1);
    if (!id) {
      e.preventDefault();
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setOpen(false);
    scrollToElement(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
  });

  mm.add(MQ.motion, () => {
    if (!bar) return;
    const hide = gsap.to(bar, { yPercent: -140, duration: 0.45, ease: 'power2.inOut', paused: true });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const keepVisible = nav.classList.contains('is-open') || nav.contains(document.activeElement);
        if (self.direction === 1 && self.scroll() > 160 && !keepVisible) hide.play();
        else hide.reverse();
      },
    });
    nav.addEventListener('focusin', () => hide.reverse());
  });

  const contact = document.querySelector('#contact');
  if (contact) {
    ScrollTrigger.create({
      trigger: contact,
      start: 'top 48px',
      end: 'bottom 48px',
      refreshPriority: SECTIONS_AFTER_PINS,
      onToggle: ({ isActive }) => nav.classList.toggle('is-on-dark', isActive),
    });
  }

  nav.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href')!);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      refreshPriority: SECTIONS_AFTER_PINS,
      onToggle: ({ isActive }) => link.classList.toggle('is-active', isActive),
    });
  });
}

