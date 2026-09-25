import { gsap, mm, MQ } from './setup';

export function initCursor() {
  mm.add(MQ.fine, () => {
    const cursor = document.querySelector<HTMLElement>('.cursor');
    const ring = cursor?.querySelector<HTMLElement>('.cursor-ring');
    if (!cursor || !ring) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: 'auto' });

      const interactive = (e.target as Element).closest('a, button');
      gsap.to(ring, { scale: interactive ? 2.6 : 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    };
    const onLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });

    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);

    const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]')).map(magnetic);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cleanups.forEach((fn) => fn());
    };
  });
}

function magnetic(el: HTMLElement) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
    yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    gsap.set(el, { x: 0, y: 0 });
  };
}
