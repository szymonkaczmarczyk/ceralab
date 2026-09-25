import { anchorOverrides, gsap, mm, MQ, scrollToElement, scrollToY, splitWords } from './setup';
import { products } from '../data/products';

export function initProducts() {
  initIntro();
  initShowcase();
}

function initIntro() {
  const intro = document.querySelector<HTMLElement>('.products-intro');
  if (!intro) return;
  const title = intro.querySelector('.products-title');
  const arches = intro.querySelectorAll('.arch');

  mm.add(MQ.motion, () => {
    if (title) {
      const split = splitWords(title);
      gsap.from(split.words, {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: title, start: 'top 85%' },
      });
    }

    gsap.from(arches, {
      y: () => Math.min(window.innerHeight * 0.35, 260),
      autoAlpha: 0,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: { trigger: intro, start: 'top 75%', end: 'top 5%', scrub: 1, invalidateOnRefresh: true },
    });
  });

  intro.querySelectorAll<HTMLAnchorElement>('[data-product-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      scrollToElement(target);
    });
  });
}

function initShowcase() {
  const showcase = document.querySelector<HTMLElement>('[data-showcase]');
  if (!showcase) return;
  const articles = gsap.utils.toArray<HTMLElement>('.product', showcase);
  const dots = gsap.utils.toArray<HTMLButtonElement>('.progress-dot', showcase);
  const bg = showcase.querySelector<HTMLElement>('.showcase-bg');
  const rootStyle = getComputedStyle(document.documentElement);
  const colors = products.map((p) => rootStyle.getPropertyValue(`--color-${p.id}`).trim());

  mm.add(MQ.pin, () => {
    showcase.classList.add('is-pinned');
    if (bg) gsap.set(bg, { backgroundColor: colors[0] });

    const parts = articles.map((article) => ({
      article,
      arch: article.querySelector('.product-arch'),
      words: splitWords(article.querySelector('.product-name')!).words,
      reveals: article.querySelectorAll('[data-reveal]'),
    }));

    parts.forEach((p, i) => {
      if (i > 0) gsap.set(p.article, { autoAlpha: 0 });
    });

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    const HOLD = 0.5;
    tl.addLabel('p0', 0).to({}, { duration: HOLD });

    for (let i = 1; i < parts.length; i++) {
      const prev = parts[i - 1];
      const next = parts[i];
      const at = `t${i}`;
      tl.addLabel(at)
        .to(prev.arch, { yPercent: -115, rotation: -7, duration: 1 }, at)
        .to(prev.words, { yPercent: -110, duration: 0.5, stagger: 0.03 }, at)
        .to(prev.reveals, { y: -30, autoAlpha: 0, duration: 0.45, stagger: 0.03 }, at)
        .to(bg, { backgroundColor: colors[i], duration: 1, ease: 'none' }, at)
        .set(prev.article, { autoAlpha: 0 }, `${at}+=1`)
        .set(next.article, { autoAlpha: 1 }, at)
        .from(next.arch, { yPercent: 115, rotation: 7, duration: 1 }, at)
        .from(next.words, { yPercent: 110, duration: 0.6, stagger: 0.04, ease: 'expo.out' }, `${at}+=0.4`)
        .from(next.reveals, { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, `${at}+=0.45`)
        .addLabel(`p${i}`, `${at}+=1`)
        .to({}, { duration: HOLD });
    }

    const labelTimes = parts.map((_, i) => tl.labels[`p${i}`]);

    const setActive = (index: number) => {
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
        if (i === index) d.setAttribute('aria-current', 'step');
        else d.removeAttribute('aria-current');
      });
    };

    const st = gsap.timeline({
      scrollTrigger: {
        trigger: showcase,
        start: 'top top',
        end: () => `+=${(parts.length - 1) * window.innerHeight * 1.1}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        snap: { snapTo: 'labelsDirectional', duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: 'power1.inOut' },
        onUpdate: () => {
          const t = tl.time();
          let active = 0;
          labelTimes.forEach((lt, i) => {
            if (t >= lt - 0.5) active = i;
          });
          setActive(active);
        },
      },
    });
    st.add(tl);

    const scrollFor = (i: number) => {
      const trigger = st.scrollTrigger!;
      return trigger.start + (labelTimes[i] / tl.duration()) * (trigger.end - trigger.start);
    };

    const onDot = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.goto);
      scrollToY(scrollFor(i));
    };
    dots.forEach((d) => d.addEventListener('click', onDot));
    products.forEach((p, i) => anchorOverrides.set(`product-${p.id}`, () => scrollFor(i)));

    return () => {
      showcase.classList.remove('is-pinned');
      dots.forEach((d) => d.removeEventListener('click', onDot));
      products.forEach((p) => anchorOverrides.delete(`product-${p.id}`));
    };
  });

  mm.add(`${MQ.noPin}`, () => {
    if (window.matchMedia(MQ.reduce).matches) return;
    articles.forEach((article) => {
      gsap.from(article.querySelectorAll('.product-arch, .product-name, [data-reveal]'), {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: article, start: 'top 80%' },
      });
    });
  });
}

