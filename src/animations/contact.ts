import { gsap, mm, MQ, ScrollTrigger, splitWords } from './setup';

export function initContact() {
  const section = document.querySelector<HTMLElement>('#contact');
  if (!section) return;

  mm.add(MQ.motion, () => {
    initMarquee(section);

    const title = section.querySelector('.contact-title');
    const tl = gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.contact-grid'), start: 'top 75%' } });
    if (title) tl.from(splitWords(title).words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0);
    tl.from(section.querySelector('.say-hello'), { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
      .from(section.querySelector('.contact-divider'), { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 0.1)
      .from(section.querySelectorAll('.contact-item'), { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.35);
  });
}

function initMarquee(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>('.marquee-track');
  if (!track) return;

  const clones = Array.from(track.children).map((child) => {
    const clone = child.cloneNode(true) as HTMLElement;
    track.appendChild(clone);
    return clone;
  });

  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => (isActive ? loop.play() : loop.pause()),
    onUpdate: (self) => {
      const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
      const direction = self.direction === -1 ? -1 : 1;
      gsap.to(loop, { timeScale: direction * (1 + Math.abs(boost)), duration: 0.2, overwrite: true });
      gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: 'power2.out' });
    },
  });

  return () => {
    st.kill();
    clones.forEach((c) => c.remove());
  };
}
