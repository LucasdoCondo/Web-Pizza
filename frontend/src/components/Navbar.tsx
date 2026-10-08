import { useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';
import { gsap, scrollToSection } from '../hooks/useSmoothScroll';

export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bar.current, { y: -70, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);
  const links = [
    { label: 'Cardápio', target: '#cardapio' },
    { label: 'História', target: '#historia' },
    { label: 'Concierge', target: '#concierge' }
  ];
  return (
    <header ref={bar} className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-noir/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <button onClick={() => scrollToSection('#hero')} className="flex items-center gap-2.5 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brasao to-gold-deep shadow-ember">
            <Flame size={17} className="text-cream" />
          </span>
          <span>
            <span className="font-display block text-lg leading-none tracking-wide">Bella Notte</span>
            <span className="text-[10px] uppercase tracking-lux text-gold/90">Forno a lenha · 48h</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 text-sm text-smoke md:flex">
          {links.map((l) => (
            <button key={l.label} onClick={() => scrollToSection(l.target)} className="transition hover:text-gold-soft">
              {l.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => scrollToSection('#concierge')}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-noir shadow-lux transition hover:brightness-110"
        >
          Pedir agora
        </button>
      </div>
    </header>
  );
}
