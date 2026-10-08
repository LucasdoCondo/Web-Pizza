import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useSmoothScroll';

/** Morphing do background conforme a jornada: mistério -> brasa -> acolhimento. */
export default function useBackgroundMorph(target: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: target.current, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
      });
      tl.to(target.current, { backgroundColor: '#0b0b0c', duration: 1 }) // Hero — mistério
        .to(target.current, { backgroundColor: '#140f0a', duration: 1 }) // Cardápio — brasa suave
        .to(target.current, { backgroundColor: '#1a0f10', duration: 1 }) // História — vinho/brasão
        .to(target.current, { backgroundColor: '#12100a', duration: 1 }); // Concierge — âmbar acolhedor
    });
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [target]);
}
