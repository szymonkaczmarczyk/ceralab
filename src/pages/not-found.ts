import { bootCommon, fontsReady, markReady } from '../common';
import '../styles/pages/not-found.css';
import { gsap, mm, MQ, splitWords } from '../animations/setup';

async function boot() {
  await fontsReady;
  bootCommon();

  mm.add(MQ.motion, () => {

    const paths = gsap.utils.toArray<SVGPathElement>('.nf-mark path');
    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    const title = document.querySelector('.nf-title');
    const arches = gsap.utils.toArray<HTMLElement>('.nf-arch');

    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('.nav-bar', { yPercent: -140, duration: 1 }, 0)
      .from('.nf-eyebrow', { y: 16, autoAlpha: 0, duration: 0.8 }, 0.1)
      .from('.nf-digit > span', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.15)
      .to(paths, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.15 }, 0.3)
      .from(title ? splitWords(title).words : [], { yPercent: 110, duration: 1.1, stagger: 0.05 }, 0.55)
      .from('.nf-lead, .nf-actions', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.8)
      .from(arches, { yPercent: 100, duration: 1.4, stagger: 0.1 }, 0.6);

    gsap.to('.nf-mark', { rotation: 360, duration: 24, ease: 'none', repeat: -1, transformOrigin: '50% 50%', delay: 1.8 });
    arches.forEach((arch, i) => {
      gsap.to(arch, { y: -14, duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 + i * 0.3 });
    });
  });

  markReady();

  mm.add(MQ.fine, () => {
    const row = document.querySelector<HTMLElement>('.nf-arches');
    if (!row) return;
    const xTo = gsap.quickTo(row, 'x', { duration: 0.8, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => xTo((e.clientX / window.innerWidth - 0.5) * -40);
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  });
}

void boot();
