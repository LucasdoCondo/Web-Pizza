import { useEffect, useRef } from 'react';
import { Leaf, Quote, Wheat } from 'lucide-react';
import { gsap } from '../hooks/useSmoothScroll';

const CARDS = [
  {
    icon: Wheat, kicker: '02 — A nossa massa', title: 'História da Massa',
    body: 'Farinha 00 de Nápoles, água filtrada, sal marinho e 48 horas de paciência. Fermentação lenta = alveolado crocante, miolo leve, digestão feliz.',
    bg: 'from-[#1a130b] to-[#241a10]', accent: 'text-gold'
  },
  {
    icon: Leaf, kicker: '03 — Origem obsessiva', title: 'Ingredientes Importados',
    body: 'San Marzano do Vesúvio, fior di latte DOP da Campânia, azeite monocultivar, presunto 24 meses. Poucos ingredientes, zero atalhos.',
    bg: 'from-[#191014] to-[#251318]', accent: 'text-brasao'
  },
  {
    icon: Quote, kicker: '04 — Quem prova, volta', title: 'Depoimentos',
    body: '“A melhor margherita fora de Nápoles.” — Guia Forchetta d’Oro · 4.9★ em 2.400 provas · “O chat monta o pedido em 1 minuto.” — cliente habitual.',
    bg: 'from-[#101418] to-[#14201c]', accent: 'text-gold-soft'
  }
];

/** Sticky stacking: cada cartão cola e o seguinte sobrepõe com escala. */
export default function StickyCards() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stack-card').forEach((card, i, arr) => {
        if (i === arr.length - 1) return;
        gsap.to(card, {
          scale: 0.92, opacity: 0.55, filter: 'blur(2px)', ease: 'none',
          scrollTrigger: { trigger: arr[i + 1], start: 'top bottom', end: 'top top+=120', scrub: 1 }
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="historia" ref={root} className="relative mx-auto max-w-5xl px-5 py-10 md:px-8">
      {CARDS.map((c) => (
        <div key={c.title} className="sticky top-[86px] mb-8">
          <article className={`stack-card rounded-[2rem] border border-white/10 bg-gradient-to-br ${c.bg} p-8 shadow-2xl md:p-14`}>
            <c.icon size={26} className={c.accent} />
            <p className="mt-5 text-[11px] uppercase tracking-lux text-smoke">{c.kicker}</p>
            <h3 className="font-display mt-2 text-4xl md:text-6xl">{c.title}</h3>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-cream/80">{c.body}</p>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-gold/60 via-white/10 to-transparent" />
          </article>
        </div>
      ))}
    </section>
  );
}
