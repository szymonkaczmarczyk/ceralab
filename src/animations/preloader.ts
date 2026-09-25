import { gsap, reducedMotion } from './setup';

const VISITED_KEY = 'ceralab:visited';

function wasVisited(): boolean {
  try {
    return sessionStorage.getItem(VISITED_KEY) === '1';
  } catch {
    return false;
  }
}

function markVisited() {
  try {
    sessionStorage.setItem(VISITED_KEY, '1');
  } catch {

  }
}

export function runPreloader(ready: Promise<unknown>): Promise<void> {
  const el = document.querySelector<HTMLElement>('#preloader');
  if (!el) return Promise.resolve();

  const done = () => {
    el.classList.add('is-done');
    markVisited();
  };

  if (reducedMotion()) {
    return ready.then(() => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: done });
    });
  }

  const quick = wasVisited();
  const paths = el.querySelectorAll<SVGPathElement>('path');
  const count = el.querySelector<HTMLElement>('[data-count]');
  const counter = { value: 0 };

  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });

  const drawDur = quick ? 0.35 : 1.3;
  const intro = gsap.timeline();
  intro
    .to(paths, { strokeDashoffset: 0, duration: drawDur, ease: 'power2.inOut', stagger: quick ? 0.05 : 0.18 }, 0)
    .to(
      counter,
      {
        value: 100,
        duration: drawDur + (quick ? 0.05 : 0.18),
        ease: 'power1.inOut',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(counter.value));
        },
      },
      0,
    );

  return Promise.all([intro.then(), ready]).then(
    () =>
      new Promise<void>((resolve) => {
        gsap
          .timeline({ onComplete: done })
          .to(el.children, { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.in' })
          .to(el, { yPercent: -100, duration: quick ? 0.6 : 1.1, ease: 'expo.inOut' }, '-=0.05')

          .call(resolve, [], quick ? 0.35 : 0.65);
      }),
  );
}
