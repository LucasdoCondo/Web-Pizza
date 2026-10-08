import { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { PIZZAS, money } from '../data/menu';
import { gsap, ScrollTrigger } from '../hooks/useSmoothScroll';

/** Scroll vertical -> carrossel horizontal (galeria de luxo). */
export default function HorizontalMenu({ onAdd }: { onAdd: (id: string) => void }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${dist()}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      gsap.utils.toArray<HTMLElement>('.menu-card').forEach((card) => {
        gsap.fromTo(card, { y: 60, opacity: 0.4 }, {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: undefined, start: 'top 95%', end: 'top 60%', scrub: 1 }
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cardapio" ref={root} className="relative overflow-hidden">
      <div className="flex h-screen flex-col justify-center">
        <div className="mx-auto mb-8 w-full max-w-7xl px-5 md:px-8">
          <p className="text-[11px] uppercase tracking-lux text-gold">01 — Galeria comestível</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display max-w-xl text-4xl leading-tight md:text-6xl">
              Clássicas & <span className="gold-text italic">Especiais</span>
            </h2>
            <p className="flex items-center gap-2 text-xs uppercase tracking-lux text-smoke">
              Continua a descer <ArrowRight size={14} className="text-gold" /> o menu desliza
            </p>
          </div>
        </div>
        <div ref={track} className="flex w-max items-stretch gap-6 px-[6vw] will-change-transform">
          {PIZZAS.map((p, i) => (
            <article key={p.id} className="menu-card group relative w-[78vw] shrink-0 overflow-hidden rounded-[1.8rem] border border-white/10 bg-noir-card sm:w-[380px]">
              <div className="relative h-[300px] overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />
                {p.badge && <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-noir">{p.badge}</span>}
                <span className="font-display absolute bottom-3 right-5 text-6xl text-white/15">0{i + 1}</span>
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-lux text-brasao">{p.tagline}</p>
                <div className="mt-1 flex items-center justify-between">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <span className="text-lg text-gold-soft">{money(p.price)}</span>
                </div>
                <p className="mt-2 min-h-[44px] text-sm leading-relaxed text-smoke">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-smoke">{t}</span>)}
                </div>
                <button onClick={() => onAdd(p.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream py-3 text-sm font-semibold text-noir transition hover:bg-gold">
                  <Plus size={15} /> Adicionar ao pedido
                </button>
              </div>
            </article>
          ))}
          <div className="grid w-[70vw] shrink-0 place-items-center rounded-[1.8rem] border border-dashed border-gold/40 bg-gold/5 sm:w-[320px]">
            <p className="font-display max-w-[200px] text-center text-2xl italic text-gold-soft">…e o concierge monta a tua obra-prima.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
