import { useEffect, useRef } from 'react';
import { ArrowDown, Flame, Star, Wheat } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../hooks/useSmoothScroll';

/** Hero — scrubbed text reveal + zoom espacial 3D da pizza assinatura. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1) reveal máscara por linha, scrubado
      gsap.utils.toArray<HTMLElement>('.hero-line > span').forEach((el, i) => {
        gsap.fromTo(el, { yPercent: 110 }, {
          yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: root.current, start: `${i * 8}% top`, end: '45% top', scrub: 1 }
        });
      });
      // 2) parágrafos / badges dissolvem e sobem
      gsap.utils.toArray('.hero-fade').forEach((el) => {
        gsap.fromTo(el as HTMLElement, { opacity: 0.15, y: 24 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '40% top', scrub: 1 }
        });
      });
      // 3) zoom espacial: pizza avança em Z + roda subtilmente
      gsap.to('.hero-pizza', {
        scale: 1.35, z: 180, rotate: 12, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1.2 }
      });
      gsap.to('.hero-glow', {
        opacity: 0.9, scale: 1.2, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: 1 }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // parallax de cursor na pizza
  const onMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    gsap.to('.hero-pizza-inner', { x, y, rotateY: x / 1.5, rotateX: -y / 1.5, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <section id="hero" ref={root} onMouseMove={onMove} className="perspective-stage relative flex min-h-[108vh] items-center overflow-hidden pt-24">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),rgba(230,57,70,0.12)_55%,transparent_70%)] blur-2xl" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <p className="hero-fade mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-lux text-gold-soft">
            <Wheat size={13} /> Fermentação natural · 48 horas
          </p>
          <h1 className="font-display text-[13vw] leading-[0.95] md:text-[5.6rem]">
            <span className="mask-line hero-line"><span>A noite</span></span>
            <span className="mask-line hero-line"><span className="italic text-cream/90">tem sabor</span></span>
            <span className="mask-line hero-line"><span className="gold-text italic">a lenha.</span></span>
          </h1>
          <p className="hero-fade mt-6 max-w-md text-[15px] leading-relaxed text-smoke">
            Massa viva de 48h, San Marzano DOP e forno a 450°C. Uma galeria comestível —
            desliza para provar com os olhos, fica pelo perfume.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => scrollToSection('#cardapio')} className="rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-noir transition hover:bg-gold-soft">
              Explorar cardápio
            </button>
            <button onClick={() => scrollToSection('#concierge')} className="rounded-full border border-white/15 px-7 py-3.5 text-sm text-cream transition hover:border-gold/60 hover:text-gold-soft">
              Falar com o concierge
            </button>
          </div>
          <div className="hero-fade mt-8 flex items-center gap-5 text-xs text-smoke">
            <span className="flex items-center gap-1.5"><Star size={13} className="fill-gold text-gold" /> 4.9 · 2.4k provas</span>
            <span className="flex items-center gap-1.5"><Flame size={13} className="text-brasao" /> 450°C · carvalho & faia</span>
          </div>
        </div>
        <div className="preserve-3d relative mx-auto w-full max-w-[440px]">
          <div className="hero-pizza preserve-3d will-change-transform">
            <div className="hero-pizza-inner preserve-3d overflow-hidden rounded-[2.2rem] border border-white/10 shadow-lux">
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80" alt="Bella Notte assinatura" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-noir/70 p-4 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-lux text-gold">Assinatura Nº 01</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="font-display text-xl">Bella Notte</p>
                  <p className="text-sm text-gold-soft">€18,90</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => scrollToSection('#cardapio')} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-lux text-smoke">
        Desliza <ArrowDown size={15} className="animate-bounce text-gold" />
      </button>
    </section>
  );
}
