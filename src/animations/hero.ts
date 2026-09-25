import { gsap, mm, MQ, reducedMotion, ScrollTrigger, splitWords } from './setup';

const hero = () => document.querySelector<HTMLElement>('#hero');

let introTl: gsap.core.Timeline | null = null;

export function prepareHeroIntro() {
  const root = hero();
  if (!root || reducedMotion()) return;

  const title = root.querySelector('.hero-title');
  const split = title ? splitWords(title) : null;

  introTl = gsap
    .timeline({ paused: true })
    .from('.hero-media', { scale: 1.15, duration: 2.2, ease: 'expo.out' }, 0)
    .from('.nav-bar', { yPercent: -140, duration: 1, ease: 'expo.out' }, 0.2)
    .from(root.querySelector('.hero-eyebrow'), { y: 16, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.15)
    .from(split?.words ?? [], { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.2)
    .from(root.querySelectorAll('.hero-lead, .hero-actions'), { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.6)
    .from(root.querySelectorAll('.video-toggle, .scroll-cue'), { autoAlpha: 0, duration: 0.6 }, 1)
    .from('.scroll-cue-line', { scaleY: 0, duration: 0.8, ease: 'power2.out' }, 1.1);
}

export function playHeroIntro() {
  introTl?.play();
}

export function initHero() {
  const root = hero();
  if (!root) return;

  initVideo(root);

  mm.add(MQ.motion, () => {
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
      .to(root.querySelector('.hero-content'), { yPercent: -35, autoAlpha: 0, ease: 'none' }, 0)
      .to(root.querySelector('.hero-video'), { yPercent: 12, ease: 'none' }, 0);

    gsap.fromTo(
      '.scroll-cue-line',
      { scaleY: 1, transformOrigin: 'top' },
      { scaleY: 0, transformOrigin: 'bottom', duration: 1.2, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.4, delay: 2.4 },
    );
  });
}

function initVideo(root: HTMLElement) {
  const video = root.querySelector<HTMLVideoElement>('.hero-video');
  const toggle = root.querySelector<HTMLButtonElement>('.video-toggle');
  if (!video || !toggle) return;

  let userPaused = false;

  const setPaused = (paused: boolean) => {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Odtwórz wideo w tle' : 'Wstrzymaj wideo w tle');
  };

  if (reducedMotion()) {
    video.removeAttribute('autoplay');
    video.pause();
    userPaused = true;
    setPaused(true);
  }

  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      void video.play().catch(() => undefined);
      setPaused(false);
    } else {
      userPaused = true;
      video.pause();
      setPaused(true);
    }
  });

  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => {
      if (userPaused) return;
      if (isActive) void video.play().catch(() => undefined);
      else video.pause();
    },
  });
}
