import { gsap, mm, MQ, ScrollTrigger, splitWords } from './setup';

export function initProcess() {
  const section = document.querySelector<HTMLElement>('#process');
  if (!section) return;
  const steps = gsap.utils.toArray<HTMLElement>('.step', section);
  const list = section.querySelector('.process-steps');

  steps.forEach((step) => {
    ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 62%', toggleClass: 'is-active' });
  });

  mm.add(MQ.motion, () => {
    const title = section.querySelector('.process-title');
    if (title) {
      gsap.from(splitWords(title).words, {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: title, start: 'top 85%' },
      });
    }

    gsap.from(section.querySelectorAll('.process-head .eyebrow, .process-intro'), {
      y: 20,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 75%' },
    });

    steps.forEach((step) => {
      gsap
        .timeline({ scrollTrigger: { trigger: step, start: 'top 85%' } })
        .from(step.querySelector('.step-line'), { scaleX: 0, duration: 1, ease: 'expo.out' }, 0)
        .from(step.querySelector('.step-num'), { yPercent: 60, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
        .from(step.querySelector('.step-text')!.children, { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.15);
    });

    if (list) {
      gsap.to(section.querySelector('.process-rail-fill'), {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: true },
      });
    }
  });
}
