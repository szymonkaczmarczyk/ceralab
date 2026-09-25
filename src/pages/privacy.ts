import { bootCommon, fontsReady, markReady } from '../common';
import '../styles/pages/privacy.css';
import { gsap, mm, MQ, ScrollTrigger, splitWords } from '../animations/setup';

async function boot() {
  await fontsReady;
  bootCommon();

  const article = document.querySelector<HTMLElement>('.policy-article');
  const sections = gsap.utils.toArray<HTMLElement>('.policy-section');
  const tocLinks = new Map(
    gsap.utils.toArray<HTMLAnchorElement>('.toc-link').map((a) => [a.dataset.toc!, a] as const),
  );
  const details = document.querySelector<HTMLDetailsElement>('.toc-details');

  mm.add({ desktop: '(min-width: 1000px)', mobile: '(max-width: 999px)' }, (ctx) => {
    if (details) details.open = !!ctx.conditions?.desktop;
  });

  sections.forEach((section) => {
    const link = tocLinks.get(section.id);
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: ({ isActive }) => {
        link?.classList.toggle('is-active', isActive);
        if (isActive) link?.setAttribute('aria-current', 'location');
        else link?.removeAttribute('aria-current');
      },
    });
  });

  tocLinks.forEach((link) =>
    link.addEventListener('click', () => {
      if (details && window.matchMedia('(max-width: 999px)').matches) details.open = false;
    }),
  );

  mm.add(MQ.motion, () => {
    const title = document.querySelector('.policy-title');
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('.nav-bar', { yPercent: -140, duration: 1 }, 0)
      .from('.policy-eyebrow', { y: 16, autoAlpha: 0, duration: 0.8 }, 0.1)
      .from(title ? splitWords(title).words : [], { yPercent: 110, duration: 1.2, stagger: 0.08 }, 0.15)
      .from('.policy-lead, .policy-meta', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.5)
      .from('.summary-card', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.65)
      .from('.policy-aside', { x: -20, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.9);

    if (article) {
      const progress = { trigger: article, start: 'top 60%', end: 'bottom bottom', scrub: 0.3 };
      gsap.to('.read-progress-bar', { scaleX: 1, ease: 'none', scrollTrigger: progress });
      gsap.to('.toc-track-fill', { scaleY: 1, ease: 'none', scrollTrigger: { ...progress } });
    }

    sections.forEach((section) => {
      gsap
        .timeline({ scrollTrigger: { trigger: section, start: 'top 85%' } })
        .from(section.querySelector('.policy-num'), { yPercent: 60, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0)
        .from(section.querySelector('.policy-heading'), { y: 14, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0.05)
        .from(section.querySelectorAll('.policy-body > *, .purpose'), { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: 'power1.out' }, 0.12);
    });
  });

  markReady();
}

void boot();
