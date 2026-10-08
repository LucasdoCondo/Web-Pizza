import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      cancelAnimationFrame(id);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

export function scrollToSection(selector: string) {
  if (lenis) lenis.scrollTo(selector, { offset: 0, duration: 1.6 });
  else document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
